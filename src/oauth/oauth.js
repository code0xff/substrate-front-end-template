const requestToken = (code) => {
  const params = {
    'grant_type': 'authorization_code',
    'code': code,
    'redirect_uri': 'http://localhost:8000/callback',
    'scope': 'profile',
  }

  let formBody = []
  for (let key in params) {
    const encodedKey = encodeURIComponent(key)
    const encodedValue = encodeURIComponent(params[key])
    formBody.push(`${encodedKey}=${encodedValue}`)
  }
  formBody = formBody.join('&')
  // console.log(formBody)

  return fetch(`http://localhost:9999/api/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      'Authorization': `Basic ${btoa('JJuzRtzmyV2S4h8tvLdR-Q' + ':' + '10883ead3b88e28f02ebe199ab0b0b4edd1ee538c4430a0e2cfdd4af16eb4647')}`,
    },
    body: formBody,
  })
}

const requestResource = (accessToken) => {
  return fetch(`http://localhost:9999/api/v1/oauth2/resource`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  })
}

export {
  requestToken,
  requestResource,
}