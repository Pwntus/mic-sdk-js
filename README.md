# Managed IoT Cloud JavaScript SDK
Get up and running in no time with Telenor Start IoT and the Managed IoT Cloud (MIC) platform with this JavaScript SDK!

## Installing
```
npm install mic-sdk-js

// or yarn
yarn add mic-sdk-js
```

A standalone distribution can also be used directly in the web browser:
```html
<html>
  <head></head>
  <body>
    <script src=""></script>
  </body>
</html>
```

## Usage
```javascript
import MIC from 'mic-sdk-js'

MIC.init({
  username: '<MIC username>',
  password: '<MIC password>'
})
.then(() => {
  // Done
})
.catch(err => console.log('Error: ', err))
```

### MIC.token
The session token for an authenticated Cognito user.

### MIC.refreshToken
The refresh token used to refresh the session for an authenticated Cognito user.

### MIC.manifest
The MIC manifest object.

### MIC.account
User account information for an authenticated Cognito user.

## API

### MIC.init(config: object)

Available config options:

```js
{
  // The MIC username
  username: '<MIC username>',

  // The MIC password
  password: '<MIC password>',

  // The MIC stack
  // This is optional and the default value
  // is 'startiot.mic.telenorconnexion.com'
  stack: 'startiot.mic.telenorconnexion.com'
}
```

This method must be called before any other methods are used.

**Return:** promise

---

### MIC.post(endpoint: string, body: object)

  * `endpoint`: the REST API endpoint
  * `body`: the REST API payload body

Call a REST API with the HTTP POST method.

**Return:** `response` promise

---

### MIC.get(endpoint: string, queryParams: object)

  * `endpoint`: the REST API endpoint
  * `queryParams`: the REST API query parameters

Call a REST API with the HTTP GET method.

**Return:** `response` promise
