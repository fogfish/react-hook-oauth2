//
// Copyright (C) 2019 Dmitry Kolesnikov
//
// This file may be modified and distributed under the terms
// of the MIT license.  See the LICENSE file for details.
// https://github.com/fogfish/react-hook-oauth2
//
import React from 'react'
import {
  PENDING,
  FAILURE,
  SUCCESS,
  UNKNOWN,
  OAUTH2_INTROSPECT,
} from './types'
import { useSecureLookup } from './hook'

//
// HoC: details about signed in user
export const Introspect = Component => {
  const { status } = useSecureLookup(OAUTH2_INTROSPECT)
  return (<Component status={status} />)
}

//
// HoC: details about signed in user
export const WhoIs = Component => {
  const [whois, updateState] = React.useState({})

  React.useEffect(() => {
    const ref = setInterval(
      () => {
        const t = JSON.parse(window.localStorage.getItem('access_token'))
        if (t && Object.keys(t).length !== 0) {
          clearInterval(ref)
          updateState(t)
        }
      },
      500,
    )
    return () => clearInterval(ref)
  }, [])
  return (<Component {...whois} />)
}

//
// HoC: Loading and Error branch
export const WhileIO = (...Components) => props => (
  Components.reduce((acc, f) => acc || f(props), null)
)

export const Unknown = Component => ({ status, ...props }) => {
  if (status instanceof UNKNOWN) {
    return <Component status={status} {...props} />
  }
  return null
}

export const Pending = Component => ({ status, ...props }) => {
  if (status instanceof PENDING) {
    return <Component status={status} {...props} />
  }
  return null
}

export const Failure = Component => ({ status, ...props }) => {
  if (status instanceof FAILURE) {
    return <Component status={status} {...props} />
  }
  return null
}

export const Success = (Component, fn = () => true) => ({ status, ...props }) => {
  if (status instanceof SUCCESS && fn(status.content)) {
    return <Component status={status} {...status} {...props} />
  }
  return null
}
