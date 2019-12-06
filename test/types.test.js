import {
  UNKNOWN,
  PENDING,
  FAILURE,
  SUCCESS,
} from '../src/index'
import * as oauth2 from '../src/types'

test('sum types to defined IO status', () => {
  expect(new UNKNOWN() instanceof UNKNOWN).toBe(true)
  expect(new PENDING() instanceof PENDING).toBe(true)
  expect(new FAILURE({}) instanceof FAILURE).toBe(true)
  expect(new SUCCESS({}) instanceof SUCCESS).toBe(true)
})

test('oauth2 config', () => {
  expect(oauth2.OAUTH2_AUTHORIZE).toBe('https://localhost/oauth2/authorize')
  expect(oauth2.OAUTH2_TOKEN).toBe('https://localhost/oauth2/token')
  expect(oauth2.OAUTH2_TRYOUT).toBe('https://localhost/oauth2/tryout')
  expect(oauth2.OAUTH2_CLIENT_ID).toBe('deadbeef')
  expect(oauth2.OAUTH2_FLOW_TYPE).toBe('code')
  expect(oauth2.OAUTH2_SCOPE).toBe('')
})
