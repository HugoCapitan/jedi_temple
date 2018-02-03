const axios = require('axios')
const ppConfig = require('../config/paypal')

// const apiUrl = paypal.apiPaymentUrl
let authorization, userRequest, userResponse
let unahilXP, kampaXP

module.exports = {
  createPayment: async (req, res) => {
    try {
      const payUrl = ppConfig.payUrl
      const token = await getAuthToken()
      const payment = buildPaymentRequest(req.body)
      const createResponse = await axios({
        url: payUrl,
        method: 'post',
        data: payment,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      })

      const approvalUrl = JSON.stringify(createResponse.data.links).find(link => link.rel === 'approval_url')
      if (req.body.method === 'paypal' && approvalUrl) {
        res.headers()
        res.redirect(approvalUrl.href)
      } else if (req.body.method === 'credit_card')
        res.redirect(req.body.paymentSuccess)
      else 
        throw new Error('Something went wrong')

    } catch(e) {
      res.status(500).send(e)
    }
  },
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

function buildPaymentRequest(paymentForm) {
  // Setting general vars
  let urls, experienceId
  if (paymentForm.store == 'unahil') {
    urls = ppConfig.unahilOpts
    experienceId = process.env.NODE_PP_UNAHIL_XP.id
  } else if (paymentForm.store == 'kampamocha') {
    urls = ppConfig.kampaOpts
    experienceId = process.env.NODE_PP_KAMPA_XP.id
  } else if (paymentForm.store == 'tuchadesigns') {
    urls = ppConfig.tuchaOpts
    experienceId = process.env.NODE_PP_TUCHA_XP.id
  }

  // Constructing common payment structure
  const payment = {
    intent: 'sale',
    payer: {
      payment_method: paymentForm.method
    },
    transactions: [{
      amount: {
        total: paymentForm.total,
        currency: 'USD',
        details: paymentForm.store == 'unahil' ? {
          night_price: paymentForm.nightPrice
        } : {
          subtotal: paymentForm.total
        },
        description: paymentForm.store == 'unahil' 
          ? `${paymentForm.nights} nights`
          : paymentForm.products.join(', ')
      }
    }]
  }

  // Constructing last part depending on the method
  if (paymentForm.method === 'paypal') {
    payment.experience_profile_id = experienceId
		payment.redirect_urls = {
			return_url: urls.executeUrl,
			cancel_url: urls.cancelUrl
		}
  } else if (paymentForm.method === 'credit_card') {
    payment.payer.funding_instruments = [{
			credit_card: {
				type: paymentForm.cardType,
				number: paymentForm.number,
				expire_month: paymentForm.expireMonth,
				expire_year: `20${paymentForm.expireYear}`,
				cvv2: paymentForm.cvv2,
				first_name: paymentForm.name.split(' ')[0],
				last_name: paymentForm.name.split(' ')[1]
			}
		}]
  }

  return payment
}
