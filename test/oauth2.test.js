import { authorize, signout } from '../src/index'

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
