const axios = require('axios')

const tokenUrl      = 'https://api.sandbox.paypal.com/v1/oauth2/token'
const experienceUrl = 'https://api.sandbox.paypal.com/v1/payment-experience/web-profiles'
const paymentUrl    = 'https://api.sandbox.paypal.com/v1/payments/payment'

module.exports = {
  createExperience,
  createExperienceEndpoint,
  createPayment,
  createPaymentEndpoint,
  getAuthToken,
  getAuthTokenEndpoint,
  getRemoteExperiences,
  getRemoteExperiencesEndpoint,
  removeExperience
}

async function createExperience(experienceBody) {
  try {
    const token = await getAuthToken()
    const experienceResponse = await axios.post(experienceUrl, experienceBody, {
      headers: {
        'Content-Type': 'application/JSON',
        'Authorization': token
      }
    })

    return experienceResponse.data    
  } catch(e) {
    throw handleAxiosError(e)
  }
}

async function createExperienceEndpoint(req, res) {
  const experience = createExperience(req.body)
  .catch(e => { res.status(500).send(e) })
  
  res.status(200).send(experience)
}

async function createPayment(paymentBody) {
  try {
    const token = await getAuthToken()
    const createResponse = await axios.post(paymentUrl, paymentBody,{
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      }
    })

    return createResponse.data
  } catch(e) {
    throw handleAxiosError(e)
  }
}

async function createPaymentEndpoint(req, res) {
  const payment = await createPayment(req.body)
  .catch(e => {
    res.status(500).send(e)
  })

  res.status(200).send(payment)
}

async function getAuthToken() {
  const clientId = process.env.NODE_PAYPAL_CLIENT_ID
  const clientSecret = process.env.NODE_PAYPAL_CLIENT_SECRET

  const tokenResponse = await axios.post(tokenUrl, {}, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    params: {
      'grant_type': 'client_credentials'
    },
    auth: {
      username: clientId,
      password: clientSecret
    }
  }).catch(e => { throw handleAxiosError(e) })

  return `Bearer ${tokenResponse.data.access_token}`
}

async function getAuthTokenEndpoint(req, res) {
  const token = await getAuthToken()
  .catch(e => { res.status(500).send(e) })

  res.status(200).send(token)
}

async function getRemoteExperiences() {
  try {
    const token    = await getAuthToken()
    const response = await axios.get(experienceUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      }
    })

    return response.data
  } catch(e) {
    throw handleAxiosError(e)
  }
}

async function getRemoteExperiencesEndpoint(req, res) {
  const experiences = await getRemoteExperiences()
  .catch(e => res.status(500).send(e))

  res.status(200).send(experiences)
}

async function removeExperience(name) {
  try {
    const token = await getAuthToken()
    const experiences = await getRemoteExperiences()

    const expToRemove = experiences.find(exp => exp.name === name)

    if (expToRemove) {
      const removeRes = await axios.delete(`${experienceUrl}/${idToRemove.id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      })

      return removeRes.data
    } else {
      return 'nothing to remove'
    }
  } catch(e) {
    throw handleAxiosError(e)
  }
}

function handleAxiosError(e) {
  if (e.response) {
    const ppError = new Error('Response error')
    ppError.response = {
      status: e.response.status,
      data: e.response.data,
      headers: e.response.headers
    }
    return ppError
  } else if (e.request) {
    const reqError = new Error('Error on request')
    reqError.request = e.request
    return reqError
  } else {
    return e
  }
}
