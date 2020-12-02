//
// Copyright (C) 2019 Dmitry Kolesnikov
//
// This file may be modified and distributed under the terms
// of the MIT license.  See the LICENSE file for details.
// https://github.com/fogfish/react-hook-oauth2
//

import {
  UNKNOWN,
  PENDING,
  FAILURE,
  SUCCESS,
  Issue,
} from '../src/index'
import * as oauth2 from '../src/types'

test('sum types that defines IO status', () => {
  expect(new UNKNOWN() instanceof UNKNOWN).toBe(true)
  expect(new PENDING() instanceof PENDING).toBe(true)
  expect(new FAILURE({}) instanceof FAILURE).toBe(true)
  expect(new SUCCESS({}) instanceof SUCCESS).toBe(true)
})

test('recoverable http issue', () => {
  const issue = new Issue(
    { status: '500' },
    { details: 'The Text', instance: 'The Instance', title: 'The Title' },
  )
  expect(issue.type).toBe('https://httpstatuses.com/500')
  expect(issue.details).toBe('The Text')
  expect(issue.instance).toBe('The Instance')
  expect(issue.title).toBe('The Title')
})

test('oauth2 config', () => {
  expect(oauth2.OAUTH2_AUTHORIZE).toBe('https://localhost/oauth2/authorize')
  expect(oauth2.OAUTH2_TOKEN).toBe('https://localhost/oauth2/token')
  expect(oauth2.OAUTH2_TRYOUT).toBe('https://localhost/oauth2/tryout')
  expect(oauth2.OAUTH2_CLIENT_ID).toBe('deadbeef')
  expect(oauth2.OAUTH2_FLOW_TYPE).toBe('code')
  expect(oauth2.OAUTH2_SCOPE).toBe('')
})

test('UNKNOWN type', () => {
  const status = new UNKNOWN()
  const f = () => 1

  expect(status instanceof UNKNOWN).toBe(true)
  expect(status.map(f)).toStrictEqual(new UNKNOWN(1))
  expect(status.map(f).yield()).toBe(1)
  expect(status.map(f).yield(x => x instanceof UNKNOWN)).toBe(true)
  expect(status.onSuccess(f)).toBe(status)
  expect(status.onFailure(f)).toBe(status)
  expect(status.onRecover(f)).toBe(status)
})

test('PENDING type', () => {
  const status = new PENDING()
  const f = () => 1

  expect(status instanceof PENDING).toBe(true)
  expect(status.map(f)).toStrictEqual(new PENDING(1))
  expect(status.map(f).yield()).toBe(1)
  expect(status.map(f).yield(x => x instanceof PENDING)).toBe(true)
  expect(status.onSuccess(f)).toBe(status)
  expect(status.onFailure(f)).toBe(status)
  expect(status.onRecover(f)).toBe(status)
})

test('FAILURE type', () => {
  const status = new FAILURE(false)
  const f = () => 1

  expect(status instanceof FAILURE).toBe(true)
  expect(status.map(f)).toStrictEqual(new FAILURE(false, 1))
  expect(status.map(f).yield()).toBe(1)
  expect(status.map(f).yield(x => x instanceof FAILURE)).toBe(true)
  expect(status.onSuccess(f)).toBe(status)
  expect(status.onFailure(f)).toStrictEqual(new FAILURE(1))
  expect(status.onRecover(f)).toStrictEqual(new SUCCESS(1))
})

test('SUCCESS type', () => {
  const status = new SUCCESS(true)
  const f = () => 1

  expect(status instanceof SUCCESS).toBe(true)
  expect(status.map(f)).toStrictEqual(new SUCCESS(1))
  expect(status.map(f).yield()).toBe(1)
  expect(status.map(f).yield(x => x instanceof SUCCESS)).toBe(true)
  expect(status.onSuccess(f)).toStrictEqual(new SUCCESS(1))
  expect(status.onFailure(f)).toBe(status)
  expect(status.onRecover(f)).toBe(status)
})
