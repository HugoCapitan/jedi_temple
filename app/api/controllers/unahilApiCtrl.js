const Reservation = require('../models/Reservation')
const Store = require('../models/Store')
const paypalCtrl = require('./paypalCtrl')

module.exports = {
  cancelPayment,
  executePayment,
  getCalendarInfo,
  makeReservation
}

async function cancelPayment(req, res) {

}

async function executePayment(req, res) {
  try {
    const thisReservation = await Reservation.findOne({ payment_id: req.params.paymentID }).exec()
    const executedPayment = await paypalCtrl.executePayment(req.query.paymentId, req.query.PayerID)

    if (executedPayment.state === 'approved') {
      thisReservation.status = 'Payed'
      thisReservation.save()
      res.status(200).redirect('http://localhost:8080/payment_success')
    } else {
      res.status(500).send(executedPayment)
    }

  } catch (e) {
    console.log(e)
  }
}

async function getCalendarInfo(req, res) {
  try {
    const unahilStore = await Store.findOne({slug: 'unahil'}).exec()
    res.status(200).json(unahilStore)
  } catch(e) {
    res.send(500).send('Unexpected Error')
  }
  
}

async function makeReservation(req, res) {
  /* 1. Create a new reservation, without paymentId for now
   * 2. Perform the payment
   *    a. For a paypal payment, respond with the redirect url
   *    b. In case of failure delete the reservation just created
   * 3. Return the answer to the browser
  */
  try {
    const thisStore      = await Store.findOne({slug: 'unahil'}).exec()
    const newReservation = await new Reservation( formatReservation(req.body, thisStore) ).save()
    const paymentToSend  = await formatPayment(req.body, newReservation, req.headers.authorization)

    if (req.body.payment_method === 'credit_card') {
      res.status(200).send('hold it bro')
    } else if (req.body.payment_method === 'paypal') {
      const reservationPayment = await paypalCtrl.createPayment(paymentToSend)
      
      newReservation.payment_id = reservationPayment.id
      newReservation.save()

      const redirection = reservationPayment.links.find(l => l.rel === 'approval_url' && l.method === 'REDIRECT')
      res.status(200).send({ redirection: redirection.href })
    }

  } catch (e) {
    console.log(e)
    if (e.response && e.response.data.details) console.log(e.response.data.details)
    res.status(500).send('unexpected error')
  }

}

////////////////////////
async function cancelReservation(req, res) {

}

async function confirmReservation(req, res) {

}

async function formatPayment(form, reservation, token) {
  const environment = process.env.NODE_ENV
  const basicPayment = {
    intent: 'sale',
    payer: {
      payment_method: form.payment_method
    },
    transactions: [{
      amount: {
        total: reservation.total,
        currency: 'USD',
        details: {
          subtotal: reservation.total
        }
      },
      description: `${form.nights} nights in The House at Bacalar for USD $${reservation.night_price} each.`
    }]
  }

  if (form.payment_method === 'credit_card') {
    basicPayment.payer.funding_instruments = [{
      credit_card: {
        type: form.card_type,
        number: form.card_number,
        expire_month: form.card_expire_month,
        expire_year: form.card_expire_year,
        cvv2: form.card_cvv2,
        first_name: form.card_name.split(' ')[0] || paymentForm.name,
        last_name: form.card_name.split(' ')[1]
      }
    }]
  } else if (form.payment_method === 'paypal') {
    const experiences = await paypalCtrl.getRemoteExperiences()
    const expProfile = experiences.find(xp => xp.name === 'unahil')

    basicPayment.experience_profile_id = expProfile.id
    basicPayment.redirect_urls = environment === 'production' ? {
      return_url: 'https://admin.unahil.com/api/unahil/execute_payment/',
      cancel_url: 'https://admin.unahil.com/api/unahil/cancel_payment/'
    } : {
      return_url: `http://localhost:8000/api/unahil/execute_payment/${token.substring(7)}`,
      cancel_url: `http://localhost:8000/api/unahil/cancel_payment/${token.substring(7)}`
    }
  }

  return JSON.stringify(basicPayment)
}

function formatReservation(form, store) {
  return {
    email: form.email,
    status: 'Awaiting Payment',
    payment_method: form.payment_method,
    arrive_date: form.arrive_date,
    departure_date: form.departure_date,
    billing_address: {
      name: form.address_name,
      email: form.email,
      address_line_1: form.address_line_1,
      address_line_2: form.address_line_2,
      city: form.address_city,
      state: form.address_state,
      country: form.address_country,
      zip: form.address_zip
    },
    night_price: form.nights > 14 
      ? store.calendar.long_stay_price
      : store.calendar.short_stay_price,
    store: 'unahil'
  }
}
