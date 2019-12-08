//
// Copyright (C) 2019 Dmitry Kolesnikov
//
// This file may be modified and distributed under the terms
// of the MIT license.  See the LICENSE file for details.
// https://github.com/fogfish/react-hook-oauth2
//

//
// encode / decode utilities
const keyval = (key, val) => (key === '' ? val : decodeURIComponent(val))
export const decode = text => (text ? JSON.parse(`{"${text.replace(/&/g, '","').replace(/=/g, '":"')}"}`, keyval) : {})
export const encode = json => Object.keys(json).map(key => ([encodeURIComponent(key), encodeURIComponent(json[key])].join('='))).join('&')
