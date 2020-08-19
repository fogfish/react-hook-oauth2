//
// Copyright (C) 2019 Dmitry Kolesnikov
//
// This file may be modified and distributed under the terms
// of the MIT license.  See the LICENSE file for details.
// https://github.com/fogfish/react-hook-oauth2
//
import { Issue } from './types'

//
//
export const jsonify = async http => {
  if (http.status >= 300 || http.status < 200) {
    const error = await http.json()
    throw new Issue(http, error)
  }
  if (http.headers) {
    return http.headers.get('Content-Type').startsWith('application/json')
      ? http.json()
      : http.text()
  }

  return http.json()
}

const recoverIncorrectCORS = error => {
  // early catch TypeError to handle 5xx errors without proper CORS header
  // convert them to network Issue to distinguish at UI recovery
  if (error instanceof TypeError) {
    throw new Issue(
      { status: 500 },
      { title: 'Unable to load remote resource due to access control check' },
    )
  }
  throw error
}

const recoverIncorrectJSON = error => {
  if (error instanceof SyntaxError) {
    throw new Issue({ status: 500 }, { title: error.message })
  }
  throw error
}

//
//
export const secureIO = (url, { headers = {}, ...spec }) => fetch(url, {
  ...spec,
  headers:
  {
    ...headers,
    Authorization: window.localStorage.getItem('access_token_bearer'),
  },
})
  .catch(recoverIncorrectCORS)
  .then(jsonify)
  .catch(recoverIncorrectJSON)

//
//
export const secureJsonIO = (url, { headers = {}, json = undefined, ...spec }) => (
  (json === undefined)
    ? secureIO(url, {
      ...spec,
      headers,
    })
    : secureIO(url, {
      ...spec,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(json),
    })
)

//
//
export const secureLookup = (url, json = undefined) => secureJsonIO(url, { method: 'GET', json })

//
//
export const secureCreate = (url, json = undefined) => secureJsonIO(url, { method: 'POST', json })

//
//
export const secureUpdate = (url, json = undefined) => secureJsonIO(url, { method: 'PUT', json })

//
//
export const secureRemove = (url, json = undefined) => secureJsonIO(url, { method: 'DELETE', json })
