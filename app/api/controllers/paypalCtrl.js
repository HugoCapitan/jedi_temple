const axios = require('axios')
const ppConfig = require('../config/paypal')

// const apiUrl = paypal.apiPaymentUrl
let authorization, userRequest, userResponse
let unahilXP, kampaXP

module.exports = {
  setUnahilXP,
  tokenEndpoint: (req, res) => {
    getToken()
    .then(result => {res.send(result)})
    // .catch(res.status(500).send)
  }
}

async function setUnahilXP () {
  const xpUrl = ppConfig.xpUrl
  const xpJson = ppConfig.xpUnahilJson


}

function getToken () {
  return new Promise((resolve, reject) => {
    const tokenUrl = ppConfig.tokenUrl
    const clientId = ppConfig.clientId
    const clientSecret = ppConfig.clientSecret

    axios({
      url: tokenUrl,
      method: 'post',
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
    })
    .then(response => {
      resolve(response.data.access_token)
    })
    .catch(reject)
  })
}
