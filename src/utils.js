
//
// encode / decode utilities
const keyval = (key, val) => (key === '' ? val : decodeURIComponent(val))
export const decode = text => (text ? JSON.parse(`{"${text.replace(/&/g, '","').replace(/=/g, '":"')}"}`, keyval) : {})
export const encode = json => Object.keys(json).map(key => ([encodeURIComponent(key), encodeURIComponent(json[key])].join('='))).join('&')
