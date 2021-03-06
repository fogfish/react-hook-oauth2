//
// Copyright (C) 2019 Dmitry Kolesnikov
//
// This file may be modified and distributed under the terms
// of the MIT license.  See the LICENSE file for details.
// https://github.com/fogfish/react-hook-oauth2
//
import { encode, decode } from './utils'
import { jsonify } from './net'
import {
  PENDING,
  FAILURE,
  SUCCESS,
  OAUTH2_CLIENT_ID,
  OAUTH2_REDIRECT_URI,
  OAUTH2_FLOW_TYPE,
  OAUTH2_SCOPE,
  OAUTH2_AUTHORIZE,
  OAUTH2_SIGNUP,
  OAUTH2_TOKEN,
  OAUTH2_TRYOUT,
  Issue,
} from './types'

const reqAuthServer = (url, actions = [], app = {}) => {
  const scope = OAUTH2_SCOPE.split(' ').concat(actions)
  const state = JSON.stringify(app)
  const request = {
    client_id: OAUTH2_CLIENT_ID,
    response_type: OAUTH2_FLOW_TYPE,
    redirect_uri: OAUTH2_REDIRECT_URI,
    scope,
    state,
  }
  window.localStorage.removeItem('access_token')
  window.localStorage.removeItem('access_token_bearer')
  window.location = `${url}/?${encode(request)}`
}

//
// authorize send a request to authority server
export const authorize = (actions = [], app = {}) => reqAuthServer(OAUTH2_AUTHORIZE, actions, app)

//
// signin send a request to authority server
export const signin = (actions = [], app = {}) => reqAuthServer(OAUTH2_AUTHORIZE, actions, app)

//
// signup send a request to authority server
export const signup = (actions = [], app = {}) => reqAuthServer(OAUTH2_SIGNUP, actions, app)

//
// signout removes access tokens from local storage
export const signout = () => {
  window.localStorage.removeItem('access_token')
  window.localStorage.removeItem('access_token_bearer')
  window.location.reload()
}

export const tryout = () => {
  window.localStorage.removeItem('access_token')
  window.localStorage.removeItem('access_token_bearer')
  window.location = `${OAUTH2_TRYOUT}`
}

const accessTokenImplicit = ({
  access_token,
  expires_in,
  ...scopes
}, updateStatus) => {
  const now = +new Date()
  const token = `Bearer ${access_token}`
  const timeout = expires_in * 1000 - 60000
  const expires = now + timeout
  const rights = { token, expires, ...scopes }
  window.localStorage.setItem('access_token', JSON.stringify(rights))
  window.localStorage.setItem('access_token_bearer', token)
  setTimeout(() => updateStatus(new FAILURE(new Issue({ status: 401 }, { title: 'expired' }))), timeout)
  return rights
}

const accessTokenExchange = async ({ code }, updateStatus) => {
  const rights = await fetch(OAUTH2_TOKEN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: encode({
      grant_type: 'authorization_code',
      client_id: OAUTH2_CLIENT_ID,
      redirect_uri: OAUTH2_REDIRECT_URI,
      code,
    }),
  })
    .then(jsonify)
    .then(x => accessTokenImplicit(x, updateStatus))
  return rights
}

const accessTokenStorage = updateStatus => {
  const token = JSON.parse(window.localStorage.getItem('access_token'))
  if (token) {
    const now = +new Date()
    setTimeout(() => updateStatus(new FAILURE(new Issue({ status: 401 }, { title: 'expired' }))), Math.max(0, token.expires - now))
    return token
  }
  throw new Issue({ status: 401 }, { title: 'unauthorized' })
}

//
// accessToken handles response from authorization server
export const accessToken = async updateStatus => {
  updateStatus(new PENDING())
  const oauth2 = decode(window.location.search.substring(1))
  window.history.replaceState({}, document.title, window.location.pathname + window.location.hash)
  try {
    if (oauth2.error) {
      throw oauth2.error
    } else if (oauth2.access_token) {
      const {
        token_type,
        token,
        expires,
        id_token,
        refresh_token,
        ...other
      } = accessTokenImplicit(oauth2, updateStatus)
      updateStatus(new SUCCESS(other))
    } else if (oauth2.code) {
      const {
        token_type,
        token,
        expires,
        id_token,
        refresh_token,
        ...other
      } = await accessTokenExchange(oauth2, updateStatus)
      updateStatus(new SUCCESS(other))
    } else {
      const {
        token_type,
        token,
        expires,
        id_token,
        refresh_token,
        ...other
      } = accessTokenStorage(updateStatus)
      updateStatus(new SUCCESS(other))
    }
  } catch (e) {
    updateStatus(new FAILURE(e))
  }
}
