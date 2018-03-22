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
  getRemoteExperiencesEndpoint
}

async function createExperience(requestBody) {
  try {
    const token = await this.getAuthToken()
    const experienceResponse = await axios.post(experienceUrl, {
      data: requestBody,
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
  const experience = this.createExperience(req.body)
  .catch(e => { res.status(500).send(e) })
  
  res.status(200).send(experience)
}

async function createPayment(requestBody) {
  try {
    const token = await this.getAuthToken()
    const createResponse = await axios.post(paymentUrl, {
      data: requestBody,
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
  const payment = await this.createPayment(req.body)
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
  const token = await this.getAuthToken()
  .catch(e => { res.status(500).send(e) })

  res.status(200).send(token)
}

async function getRemoteExperiences() {
  try {
    const token    = await getAuthToken()
    console.log(token)
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
