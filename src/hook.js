//
// Copyright (C) 2019 Dmitry Kolesnikov
//
// This file may be modified and distributed under the terms
// of the MIT license.  See the LICENSE file for details.
// https://github.com/fogfish/react-hook-oauth2
//
import { useState, useEffect, useRef } from 'react'
import { accessToken } from './oauth2'
import {
  UNKNOWN,
  PENDING,
  FAILURE,
  SUCCESS,
  Issue,
} from './types'
import {
  secureCreate,
  secureLookup,
  secureRemove,
  secureUpdate,
} from './net'

/*

effect is stateful async computation (aka promise) that
exists in one of the state: PENDING, SUCCESS or FAILURE
*/
export const effect = async (eff, updateStatus, pending = undefined) => {
  if (eff) {
    updateStatus(new PENDING(pending))
    try {
      const content = await eff()
      const status = new SUCCESS(content)
      updateStatus(status)
      return status
    } catch (error) {
      const status = new FAILURE(error)
      updateStatus(status)
      return status
    }
  }
  return new UNKNOWN()
}

/*

effectHook is helper function to wrap effects into hooks

useEffect(
  () => effectHook(() => secureRemove(url), updateStatus),
  [],
)
*/
export const effectHook = (eff, updateStatus) => {
  let effectMounted = true
  effect(eff, x => effectMounted && updateStatus(x))
  return () => { effectMounted = false }
}

const maybePanic = status => {
  if (status instanceof FAILURE && !(status.reason instanceof Issue)) {
    throw status.reason
  }
}

/*

useOAuth2 hook obtains access token
*/
export const useOAuth2 = () => {
  const [status, updateStatus] = useState(new PENDING())

  useEffect(() => {
    accessToken(updateStatus)
  }, [])

  return status
}

/*

useSecureIO is generic hook to wrap networking I/O
*/
export const useSecureIO = (eff, defaultValue, onlyAfterCommit = true) => {
  const [value, commit] = useState(defaultValue)
  const [status, updateStatus] = useState(
    defaultValue !== undefined
      ? new SUCCESS(defaultValue)
      : new UNKNOWN(),
  )
  const [attempt, updateAttempt] = useState(0)
  const retry = () => updateAttempt(attempt + 1)
  const skipFirstRun = useRef(onlyAfterCommit)

  useEffect(() => {
    if (skipFirstRun.current) {
      skipFirstRun.current = false
      return undefined
    }

    if (value !== undefined) {
      return effectHook(() => eff(value), updateStatus)
    }

    updateStatus(new UNKNOWN())
    return undefined
  }, [eff, value, attempt])
  maybePanic(status)

  return {
    status,
    retry,
    commit,
    value,
  }
}

//
//
export const useSecureLookup = endpoint => {
  const [url, updateUrl] = useState(endpoint)
  const [status, updateStatus] = useState(endpoint ? new PENDING() : new UNKNOWN())
  const [attempt, updateAttempt] = useState(0)
  const retry = () => updateAttempt(attempt + 1)
  // Note: we need to simultaneously update status and url
  const sequence = x => {
    updateStatus(x ? new PENDING() : new UNKNOWN())
    updateUrl(x)
  }

  useEffect(() => {
    if (url) {
      return effectHook(() => secureLookup(url), updateStatus)
    }
    updateStatus(new UNKNOWN())
    return undefined
  }, [url, attempt])
  maybePanic(status)
  return { status, retry, sequence }
}

//
//
export const useSecureRemove = endpoint => {
  const [url, updateUrl] = useState(endpoint)
  const [status, updateStatus] = useState(endpoint ? new PENDING() : new UNKNOWN())
  const [attempt, updateAttempt] = useState(0)
  const retry = () => updateAttempt(attempt + 1)
  // Note: we need to simultaneously update status and url
  const sequence = x => {
    updateStatus(x ? new PENDING() : new UNKNOWN())
    updateUrl(x)
  }

  useEffect(() => {
    if (url) {
      return effectHook(() => secureRemove(url), updateStatus)
    }
    updateStatus(new UNKNOWN())
    return undefined
  }, [url, attempt])
  maybePanic(status)
  return { status, retry, sequence }
}

//
//
export const useSecureCreate = (endpoint, json) => {
  const [url, updateUrl] = useState(endpoint)
  const [payload, updatePayload] = useState(json)
  const [status, updateStatus] = useState((endpoint && json) ? new PENDING() : new UNKNOWN())
  const [attempt, updateAttempt] = useState(0)
  const retry = () => updateAttempt(attempt + 1)
  // Note: we need to simultaneously update status and url
  const sequence = x => {
    updateStatus((x && payload) ? new PENDING() : new UNKNOWN())
    updateUrl(x)
  }
  const commit = x => {
    updateStatus((url && x) ? new PENDING() : new UNKNOWN())
    updatePayload(x)
  }

  useEffect(() => {
    if (url && payload) {
      return effectHook(() => secureCreate(url, payload), updateStatus)
    }
    updateStatus(new UNKNOWN())
    return undefined
  }, [url, payload, attempt])
  maybePanic(status)

  return {
    status,
    retry,
    commit,
    sequence,
  }
}

//
//
export const useSecureUpdate = (endpoint, json) => {
  const [url, updateUrl] = useState(endpoint)
  const [payload, updatePayload] = useState(json)
  const [status, updateStatus] = useState((endpoint && json) ? new PENDING() : new UNKNOWN())
  const [attempt, updateAttempt] = useState(0)
  const retry = () => updateAttempt(attempt + 1)
  // Note: we need to simultaneously update status and url
  const sequence = x => {
    updateStatus((x && payload) ? new PENDING() : new UNKNOWN())
    updateUrl(x)
  }
  const commit = x => {
    updateStatus((url && x) ? new PENDING() : new UNKNOWN())
    updatePayload(x)
  }

  useEffect(() => {
    if (url && payload) {
      return effectHook(() => secureUpdate(url, payload), updateStatus)
    }
    updateStatus(new UNKNOWN())
    return undefined
  }, [url, payload, attempt])
  maybePanic(status)

  return {
    status,
    retry,
    commit,
    sequence,
  }
}
