const Reservation = require('../models/Reservation')
const Store = require('../models/Store')
const paypalCtrl = require('./paypalCtrl')

module.exports = {
  makeReservation,
  confirmReservation,
  cancelReservation
}

async function makeReservation(req, res) {
  /* 1. Create a new reservation, without paymentId for now
   * 2. Perform the payment
   *    a. In case of success add the paymentId to the reservation
   *    b. In case of failure delete the reservation just created
   * 3. Return the answer to the browser
  */
  try {
    const thisStore = await Store.findOne({slug: 'unahil'}).exec()
    const newReservation = await new Reservation(formatReservation(req.body)).save()

    const formattedPayment = await formatPayment(req.body, newReservation)

    if (req.body.payment_method === 'credit_card') {
      res.status(200).send('hold it bro')
    } else if (req.body.payment_method === 'paypal') {
      const newPayment = await paypalCtrl.createPayment(formatPayment)
      res.status(200).send(newPayment)
    }

  } catch (e) {
    console.log(e)
    res.status(500).send('unexpected error')
  }

}

async function confirmReservation(req, res) {

}

async function cancelReservation(req, res) {

}

////////////////////////

async function formatPayment(form, reservation) {
  const basicPayment = {
    intent: 'sale',
    payer: {
      payment_method: form.payment_method
    },
    transactions: [{
      amount: {
        total,
        currency: 'USD',
        details: {
          subtotal: reservation.total
        }
      },
      description: `${reservation.nights} in The House at Bacalar for USD $${reservation.night_price} each.`
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
    basicPayment.redirect_urls = {
      return_url: '',
      cancel_url: ''
    }
  }

  return JSON.stringify(basicPayment)
}

function formatReservation(form, store) {
  return {
    email: form.email,
    status: 'awaiting for payment',
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
      country: from.address_country,
      zip: form.address_zip
    },
    night_price: form.nights > 4 
      ? store.calendar.long_stay_price
      : store.calendar.short_stay_price,
    store: 'unahil'
  }
}
