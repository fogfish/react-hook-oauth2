//
// Copyright (C) 2019 Dmitry Kolesnikov
//
// This file may be modified and distributed under the terms
// of the MIT license.  See the LICENSE file for details.
// https://github.com/fogfish/react-hook-oauth2
//

import {
  authorize,
  signin,
  signup,
  signout,
  accessToken,
  FAILURE,
  SUCCESS,
} from '../src/index'

test('authorize redirect agent to authorization server', () => {
  Object.defineProperty(window, 'location', { writable: true })
  authorize()
  expect(window.location).toBe('https://localhost/oauth2/authorize/?client_id=deadbeef&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000&scope=&state=%7B%7D')
})

test('signin redirect agent to authorization server', () => {
  Object.defineProperty(window, 'location', { writable: true })
  signin()
  expect(window.location).toBe('https://localhost/oauth2/authorize/?client_id=deadbeef&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000&scope=&state=%7B%7D')
})

test('signup redirect agent to authorization server', () => {
  Object.defineProperty(window, 'location', { writable: true })
  signup()
  expect(window.location).toBe('https://localhost/oauth2/signup/?client_id=deadbeef&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000&scope=&state=%7B%7D')
})

test('signout redirect agent to root', () => {
  Object.defineProperty(window, 'location', {
    writable: true,
    value: { reload: () => { window.location.search = '?reload' } },
  })
  signout()
  expect(window.location.search).toBe('?reload')
})

test('oauth2 flow - failure', async () => {
  Object.defineProperty(window, 'location', {
    writable: true,
    value: { search: '?error=unauthorized' },
  })
  let result
  await accessToken(x => { result = x })
  expect(result).toStrictEqual(new FAILURE('unauthorized'))
})

test('oauth2 flow - implicit token', async () => {
  Object.defineProperty(window, 'location', {
    writable: true,
    value: { search: '?access_token=implicit&expires_in=3600' },
  })
  let result
  await accessToken(x => { result = x })
  expect(result).toStrictEqual(new SUCCESS({}))
  expect(window.localStorage.getItem('access_token_bearer')).toBe('Bearer implicit')
})

test('oauth2 flow - code exchange', async () => {
  Object.defineProperty(window, 'location', {
    writable: true,
    value: { search: '?code=123' },
  })

  const mockJson = Promise.resolve({
    access_token: 'exchange',
    expires_in: 3600,
  })
  const mockFetch = Promise.resolve({ json: () => mockJson })
  global.fetch = jest.fn().mockImplementation(() => mockFetch)

  let result
  await accessToken(x => { result = x })
  expect(result).toStrictEqual(new SUCCESS({}))
  expect(window.localStorage.getItem('access_token_bearer')).toBe('Bearer exchange')
})
