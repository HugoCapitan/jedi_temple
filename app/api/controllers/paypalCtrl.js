const axios = require('axios')
const ppConfig = require('../config/paypal')

// const apiUrl = paypal.apiPaymentUrl
let authorization, userRequest, userResponse
let unahilXP, kampaXP

module.exports = {
  tokenEndpoint: (req, res) => {
    getAuthToken()
    .then(token => {res.send(token)})
    .catch(e => {res.status(500).send(e)})
  },
  setXpsEndpoint: (req, res) => {
    initXps()
    .then(data => {res.status(200).send(data)})
    .catch(e => {res.status(500).send(e)})    
  },
  getXps: (req, res) => {
    res.status(200).send({
      kampa: process.env.NODE_PP_KAMPA_XP,
      tucha: process.env.NODE_PP_TUCHA_XP,
      unahil: process.env.NODE_PP_UNAHIL_XP
    })
  }
}

async function initXps () {
  try {
    const xpUrl = ppConfig.xpUrl
    const unahilXP = ppConfig.xpUnahilReq
    const kampaXP = ppConfig.xpKampaReq
    const tuchaXP = ppConfig.xpTuchaReq
    const token = await getAuthToken()
    const commonReq = {
      url: xpUrl,
      method: 'post',
      headers: {
        'Content-Type': 'application/JSON',
        'Authorization': token
      }
    }

    const xpPromises = []
    for (const current of ['kampa', 'tucha', 'unahil']) {
      let dataJson
      if (current === 'kampa') dataJson = kampaXP
      if (current === 'tucha') dataJson = tuchaXP
      if (current === 'unahil') dataJson = unahilXP
      xpPromises.push( axios({ ...commonReq, data: dataJson }) )
    }

    const responses = await Promise.all(xpPromises)

    const experiences = responses.map(response => JSON.stringify(response.data))
    for (exp of experiences) {
      if (exp.name == kampaXP.name) process.env.NODE_PP_KAMPA_XP = exp
      if (exp.name == tuchaXP.name) process.env.NODE_PP_TUCHA_XP = exp
      if (exp.name == unahilXP.name) process.env.NODE_PP_UNAHIL_XP = exp
    }
    
    return experiences
  } catch(e) {
    if (e.response) throw ({
      status: e.response.status,
      data: e.response.data,
      headers: e.response.headers
    }) 
    else if (e.request) throw e.request
    else throw e
  }
  
}

async function getAuthToken () {
  const tokenUrl = ppConfig.tokenUrl
  const clientId = ppConfig.clientId
  const clientSecret = ppConfig.clientSecret

  const tokenResponse = await axios({
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
  }).catch(e => {throw e})

  return `Bearer ${tokenResponse.data.access_token}`
}
