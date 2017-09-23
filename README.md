# Managed IoT Cloud SDK for Node
Managed IoT Cloud (MIC) SDK for Node.

## Installing
Using npm:
```
npm install mic-sdk-js
```

## Usage: Authenticate and Cloud API Invocation
```javascript
import MIC from 'mic-sdk-js'

const api = new MIC

// Init by providing the host name used
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
init(hostname)
auth(username, password)
invoke(cloud_api, payload)

subscribe()
publish()