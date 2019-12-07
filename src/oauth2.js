import { encode, decode } from './utils'
import { jsonify } from './net'
import {
  PENDING,
  FAILURE,
  SUCCESS,
  OAUTH2_CLIENT_ID,
  OAUTH2_FLOW_TYPE,
  OAUTH2_SCOPE,
  OAUTH2_AUTHORIZE,
  OAUTH2_TOKEN,
} from './types'

//
// authorize send a request to authority server
export const authorize = () => {
  const request = {
    client_id: OAUTH2_CLIENT_ID,
    response_type: OAUTH2_FLOW_TYPE,
    scope: OAUTH2_SCOPE,
    state: 'none',
  }
  window.localStorage.removeItem('access_token')
  window.localStorage.removeItem('access_token_bearer')
  window.location = `${OAUTH2_AUTHORIZE}/?${encode(request)}`
}

//
// signout removes access tokens from local storage
export const signout = () => {
  window.localStorage.removeItem('access_token')
  window.localStorage.removeItem('access_token_bearer')
  window.location = '/'
}

//
//
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
  setTimeout(() => updateStatus(new FAILURE('expired')), timeout)
  return rights
}

//
//
const accessTokenExchange = async ({ code }, updateStatus) => {
  const rights = await fetch(OAUTH2_TOKEN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: encode({ grant_type: 'authorization_code', client_id: OAUTH2_CLIENT_ID, code }),
  })
    .then(jsonify('application/json'))
    .then(x => accessTokenImplicit(x, updateStatus))
  return rights
}

//
//
const accessTokenStorage = updateStatus => {
  const token = JSON.parse(window.localStorage.getItem('access_token'))
  const now = +new Date()
  setTimeout(() => updateStatus(new FAILURE('expired')), Math.max(0, token.expires - now))
  return token
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
      accessTokenImplicit(oauth2, updateStatus)
    } else if (oauth2.code) {
      await accessTokenExchange(oauth2, updateStatus)
    } else {
      accessTokenStorage(updateStatus)
    }
    updateStatus(new SUCCESS({}))
  } catch (e) {
    updateStatus(new FAILURE(e))
  }
}
