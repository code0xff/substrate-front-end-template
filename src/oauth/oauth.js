const requestToken = (code) => {
  const params = {
    'grant_type': 'authorization_code',
    'code': code,
    'redirect_uri': 'http://localhost:5173/callback',
    'scope': 'profile',
  }

  let formBody = []
  for (let key in params) {
    const encodedKey = encodeURIComponent(key)
    const encodedValue = encodeURIComponent(params[key])
    formBody.push(`${encodedKey}=${encodedValue}`)
  }
  formBody = formBody.join('&')

  return fetch(`${import.meta.env.VITE_KEYHUB_ENDPOINT}/api/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      'Authorization': `Basic ${btoa(import.meta.env.VITE_CLIENT_ID + ':' + import.meta.env.VITE_CLIENT_PASSWORD)}`,
    },
    body: formBody,
  })
}

const requestResource = (accessToken) => {
  return fetch(`${import.meta.env.VITE_KEYHUB_ENDPOINT}/api/v1/oauth2/resource`, {
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