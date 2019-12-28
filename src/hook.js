//
// Copyright (C) 2019 Dmitry Kolesnikov
//
// This file may be modified and distributed under the terms
// of the MIT license.  See the LICENSE file for details.
// https://github.com/fogfish/react-hook-oauth2
//
import { useState, useEffect } from 'react'
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

const ioEffect = (eff, updateStatus) => {
  let effectMounted = true
  const effect = async () => {
    updateStatus(new PENDING())

    try {
      const content = await eff()
      if (!effectMounted) return
      updateStatus(new SUCCESS(content))
    } catch (error) {
      if (!effectMounted) return
      updateStatus(new FAILURE(error))
    }
  }
  if (eff) {
    effect()
  }
  return () => { effectMounted = false }
}

const maybePanic = status => {
  if (status instanceof FAILURE && !(status.reason instanceof Issue)) {
    throw status.reason
  }
}

//
//
export const useOAuth2 = () => {
  const [status, updateStatus] = useState(new PENDING())

  useEffect(() => {
    accessToken(updateStatus)
  }, [])

  return status
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
      return ioEffect(() => secureLookup(url), updateStatus)
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
      return ioEffect(() => secureRemove(url), updateStatus)
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
      return ioEffect(() => secureCreate(url, payload), updateStatus)
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
      return ioEffect(() => secureUpdate(url, payload), updateStatus)
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
