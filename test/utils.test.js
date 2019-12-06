import { decode, encode } from '../src/utils'

test('decode uri query to json', () => {
  const json = decode('a=1&b=hello%20world')
  expect(json).toStrictEqual({ a: '1', b: 'hello world' })
})

test('encode json to uri query', () => {
  const text = encode({ a: '1', b: 'hello world' })
  expect(text).toBe('a=1&b=hello%20world')
})
