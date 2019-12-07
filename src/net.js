import { Issue } from './types'

export const jsonify = contentType => async http => {
  if (http.status >= 300 || http.status < 200) {
    const error = await http.json()
    throw new Issue(http, error)
  }
  return contentType === 'application/json' ? http.json() : http.text()
}

export const a = 1
