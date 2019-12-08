//
// Copyright (C) 2019 Dmitry Kolesnikov
//
// This file may be modified and distributed under the terms
// of the MIT license.  See the LICENSE file for details.
// https://github.com/fogfish/react-hook-oauth2
//

import { decode, encode } from '../src/utils'

test('decode uri query to json', () => {
  const json = decode('a=1&b=hello%20world')
  expect(json).toStrictEqual({ a: '1', b: 'hello world' })
})

test('encode json to uri query', () => {
  const text = encode({ a: '1', b: 'hello world' })
  expect(text).toBe('a=1&b=hello%20world')
})
