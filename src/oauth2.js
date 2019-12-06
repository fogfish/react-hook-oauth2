import { encode } from './utils'
import * as config from './types'

//
// authorize send a request to authority server
export const authorize = () => {
  const request = {
    client_id: config.OAUTH2_CLIENT_ID,
    response_type: config.OAUTH2_FLOW_TYPE,
    scope: config.OAUTH2_SCOPE,
    state: 'none',
  }
  window.localStorage.removeItem('access_token')
  window.localStorage.removeItem('access_token_bearer')
  window.location = `${config.OAUTH2_AUTHORIZE}/?${encode(request)}`
}

//
// signout removes access tokens from local storage
export const signout = () => {
  window.localStorage.removeItem('access_token')
  window.localStorage.removeItem('access_token_bearer')
  window.location = '/'
}
