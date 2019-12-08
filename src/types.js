//
// Copyright (C) 2019 Dmitry Kolesnikov
//
// This file may be modified and distributed under the terms
// of the MIT license.  See the LICENSE file for details.
// https://github.com/fogfish/react-hook-oauth2
//

//
// Sum Types to define IO status
//
class IO {}
export class UNKNOWN extends IO {}
export class PENDING extends IO {}
export class FAILURE extends IO {
  constructor(reason) {
    super()
    this.reason = reason
  }
}
export class SUCCESS extends IO {
  constructor(content) {
    super()
    this.content = content
  }
}

//
// Recoverable IO Error
// abstracts Problem Details for HTTP
// https://tools.ietf.org/html/rfc7807
export class Issue extends Error {
  constructor(http, json) {
    super(http.status)
    this.type = `https://httpstatuses.com/${http.status}`
    this.instance = json.instance
    this.title = json.title
    this.details = json.details
  }
}

//
// Global OAuth2 configuration
const HOST = process.env.REACT_APP_OAUTH2_HOST || 'localhost'
export const OAUTH2_AUTHORIZE = process.env.REACT_APP_OAUTH2_AUTHORIZE || `https://${HOST}/oauth2/authorize`
export const OAUTH2_TOKEN = process.env.REACT_APP_OAUTH2_TOKEN || `https://${HOST}/oauth2/token`
export const OAUTH2_TRYOUT = process.env.REACT_APP_OAUTH2_TRYOUT || `https://${HOST}/oauth2/tryout`
export const OAUTH2_CLIENT_ID = process.env.REACT_APP_OAUTH2_CLIENT_ID || 'deadbeef'
export const OAUTH2_FLOW_TYPE = process.env.REACT_APP_OAUTH2_FLOW_TYPE || 'code'
export const OAUTH2_SCOPE = process.env.REACT_APP_OAUTH2_SCOPE || ''
