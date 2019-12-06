import {
  authorize,
  signout,
  accessToken,
  FAILURE,
  SUCCESS,
} from '../src/index'
import '@babel/polyfill'

test('authorize redirect agent to authorization server', () => {
  Object.defineProperty(window, 'location', { writable: true })
  authorize()
  expect(window.location).toBe('https://localhost/oauth2/authorize/?client_id=deadbeef&response_type=code&scope=&state=none')
})

test('signout redirect agent to root', () => {
  Object.defineProperty(window, 'location', { writable: true })
  signout()
  expect(window.location).toBe('/')
})

test('authorization server response with error', async () => {
  Object.defineProperty(window, 'location', {
    writable: true,
    value: { search: '?error=unauthorized' },
  })
  let result
  accessToken(x => { result = x })
  expect(result).toStrictEqual(new FAILURE('unauthorized'))
})

test('authrization server returns implicit token', async () => {
  Object.defineProperty(window, 'location', {
    writable: true,
    value: { search: '?access_token=xxx&expires_in=3600' },
  })
  let result
  accessToken(x => { result = x })
  expect(result).toStrictEqual(new SUCCESS({}))
  expect(window.localStorage.getItem('access_token_bearer')).toBe('Bearer xxx')
})
