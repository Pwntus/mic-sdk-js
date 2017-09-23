# Managed IoT Cloud SDK
Managed IoT Cloud (MIC) SDK for Node.js.

Use this as an interface to easily communicate with the Cloud API's, which can be found [here](https://docs.telenorconnexion.com/mic/cloud-api/).

## Installing
Using npm:
```
npm install mic-sdk-js
```

## Usage: Authenticate and Cloud API Invocation
```javascript
import MIC from 'mic-sdk-js'

const api = new MIC

// Init by providing the host name for your app
api.init('startiot.mic.telenorconnexion.com')
.then((manifest, credentials) => {
  
  // Now, authenticate a user
  api.auth('John', '*********')
  .then(user => {

    // Invoke a cloud API with a payload
    api.invoke('ThingTypeLambda', { action: 'LIST' })
    .then(res => {
      console.log('Thing Type list: ', res)
    })
  })
})
.catch(err => console.log('Error: ', err))
```

## API

### MIC.init(hostname)
  * `hostname`: the host name used for your application

Returns a `(manifest, credentials)` promise if the manifest was successfully retrieved. This method must be called before any other methods are used.

### MIC.auth(username, password)
  * `username`: the user of the user to be authenticated
  * `password`: the password of the user to be authenticated

Authenticate a user by invoking the [`Auth API LOGIN`](https://docs.telenorconnexion.com/mic/cloud-api/auth/#login) action. Return the user object.

### MIC.invoke(cloud_api, payload)
  * `cloud_api`: the Cloud API name, refer to the [Cloud API documentation](https://docs.telenorconnexion.com/mic/cloud-api/)
  * `payload`: a payload object

Invoke a Cloud API with the given payload. Return the result object.

### MIC.subscribe()
Coming soon...

### MIC.publish()
Coming soon...
