# React Hooks for OAuth2

[![Build Status](https://secure.travis-ci.org/fogfish/react-hook-oauth2.svg?branch=master)](http://travis-ci.org/fogfish/react-hook-oauth2)
[![Git Hub](https://img.shields.io/github/last-commit/fogfish/react-hook-oauth2.svg)](http://travis-ci.org/fogfish/react-hook-oauth2)
[![npm](https://img.shields.io/npm/v/react-hook-oauth2)](https://www.npmjs.com/package/react-hook-oauth2) 

The access to all Internet facing data services must be governed by Identity and Access Management and protected with bearer access token. Consumer IAM is implemented using OAuth 2.0 protocol, see [RFC 6749](https://tools.ietf.org/html/rfc6749). IAM is implemented by trusted components outside of the application. This library helps to decouple authentication concern from business logic in react applications.

The usage of OAuth2 with Authorization Code Grant flow complicates the bootstrap of application:

* Application do not have a valid access token, the authorization is required. The application shall redirect user agent to authorization endpoint `https://auth.example.com/?response_type=code&client_id=...&state=...` before access is granted.
* Application has a valid access token but user has interrupted the browser session (close browser, refresh pages, etc). The application shall recover the token from local storage.
* Authorization server callback the application with access code that needs to be exchanged for access token before access is granted.

## Obtain access token

`useOAuth2` is a hook that facilitates integration of react application with identity providers and reports the progress of authentication, shows errors, etc.

```javascript
import { useOAuth2, WhileIO } from 'react-hook-oauth2'

const IO = WhileIO(/* Loading */, /* Error */, /* Success */)

const App = () => {
  const status = useOAuth2()
  return (<IO status={status} />)
}
```

The hook implements The behavior of OAuth 2.0 redirect endpoint is defined by RFC 6749:

> The redirection request to the client's endpoint typically results in an HTML document response, processed by the user-agent. If the HTML response is served directly as the result of the redirection request, any script included in the HTML document will execute with full access to the redirection URI and the credentials it contains. The client SHOULD NOT include any third-party scripts (e.g., third-party analytics, social plug-ins, ad networks) in the redirection endpoint response. Instead, it SHOULD extract the credentials from the URI and redirect the user-agent again to another endpoint without exposing the credentials (in the URI or elsewhere). If third-party scripts are included, the client MUST ensure that its own scripts (used to extract and remove the credentials from the URI) will execute first.

## Use access token

The access token is available at local storage. However, the library implements helper routines around `fetch` api to consumer protected data services:

```javascript
import * as io from 'react-hook-oauth2'

await io.secureLookup('https://api.example.com')

await io.secureCreate('https://api.example.com', { id: 1, title: 'Hello World.'})

await io.secureUpdate('https://api.example.com/1', { title: 'Hello World!'})

await io.secureRemove('https://api.example.com/1')
```

## Error Handling

`useOAuth2` hook returns a status using sum types. 


## How To Contribute

The library is [MIT](LICENSE) licensed and accepts contributions via GitHub pull requests:

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Added some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

```bash
git clone https://github.com/fogfish/react-hook-oauth2
cd react-hook-oauth2

npm install
npm run test
npm run lint
npm run build
```

## License

[![See LICENSE](https://img.shields.io/github/license/fogfish/react-hook-oauth2.svg?style=for-the-badge)](LICENSE)
