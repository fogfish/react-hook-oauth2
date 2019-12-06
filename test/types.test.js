import {
  UNKNOWN,
  PENDING,
  FAILURE,
  SUCCESS,
} from '../src/index'

test('sum types to defined IO status', () => {
  expect(new UNKNOWN() instanceof UNKNOWN).toBe(true)
  expect(new PENDING() instanceof PENDING).toBe(true)
  expect(new FAILURE({}) instanceof FAILURE).toBe(true)
  expect(new SUCCESS({}) instanceof SUCCESS).toBe(true)
})
