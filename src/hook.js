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
  const [url, sequence] = useState(endpoint)
  const [status, updateStatus] = useState(endpoint ? new PENDING() : new UNKNOWN())
  const [attempt, updateAttempt] = useState(0)
  const retry = () => updateAttempt(attempt + 1)

  useEffect(() => {
    const effect = !url ? undefined : () => secureLookup(url)
    ioEffect(effect, updateStatus)
  }, [url, attempt])
  maybePanic(status)
  return { status, retry, sequence }
}

//
//
export const useSecureRemove = endpoint => {
  const [url, sequence] = useState(endpoint)
  const [status, updateStatus] = useState(endpoint ? new PENDING() : new UNKNOWN())
  const [attempt, updateAttempt] = useState(0)
  const retry = () => updateAttempt(attempt + 1)

  useEffect(() => {
    const effect = !url ? undefined : () => secureRemove(url)
    ioEffect(effect, updateStatus)
  }, [url, attempt])
  maybePanic(status)
  return { status, retry, sequence }
}

//
//
export const useSecureCreate = (endpoint, json) => {
  const [url, sequence] = useState(endpoint)
  const [payload, commit] = useState(json)
  const [status, updateStatus] = useState((endpoint && json) ? new PENDING() : new UNKNOWN())
  const [attempt, updateAttempt] = useState(0)
  const retry = () => updateAttempt(attempt + 1)

  useEffect(() => {
    if (!(url && payload)) {
      updateStatus(new UNKNOWN())
    }
  }, [payload, url])
  useEffect(() => {
    const effect = !(url && payload) ? undefined : () => secureCreate(url, payload)
    ioEffect(effect, updateStatus)
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
  const [url, sequence] = useState(endpoint)
  const [payload, commit] = useState(json)
  const [status, updateStatus] = useState((endpoint && json) ? new PENDING() : new UNKNOWN())
  const [attempt, updateAttempt] = useState(0)
  const retry = () => updateAttempt(attempt + 1)

  useEffect(() => {
    if (!(url && payload)) {
      updateStatus(new UNKNOWN())
    }
  }, [payload, url])
  useEffect(() => {
    const effect = !(url && payload) ? undefined : () => secureUpdate(url, payload)
    ioEffect(effect, updateStatus)
  }, [url, payload, attempt])
  maybePanic(status)

  return {
    status,
    retry,
    commit,
    sequence,
  }
}
