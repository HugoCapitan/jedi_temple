const paypalCtrl = require('../../paypalCtrl')

jest.mock('axios')
const axios = require('axios')

describe('paypalCtrl', () => {

  describe('buildPaymentRequest', () => {
    let kampaCdMockPaymentOpts, kampaPpMockPaymentOpts,
        unahCdMockPaymentOpts, unahPpMockPaymentOpts,
        kampaCdMockPaymentReq, kampaPpMockPaymentReq,
        unahCdMockPaymentReq, kampaPpMockPaymentReq

    beforeEach(() => {
      createPaymentOtionsObjects()
      createPaymentRequestsObjects()
    })

    test('Should return a correct credit_card payment obj (paypal, unahil)')

    test('Should return a correct credit_card payment obj (credit_card, unahil)')

    test('Should return a correct credit_card payment obj (paypal, kampamocha)')

    test('Should return a correct credit_card payment obj (credit_card, kampamocha)')    

    test('Should return an error malformed paymentForm (method=paypal)')

    test('Should return an error malformed paymentForm (method=credit_card)')
    
    test('Should return an error -> URLS not found')

    test('Should return an error -> Experience not found')

  })

  describe('createPayment', () => {

    test('Should call get token')

    test('Should call buildPayment')

    test('Should call axios with correct method and options')

    test('Should check on response for redirect url and cal res.redirect (paypal)')

    test('Should check on response for redirect url and cal res.redirect (credit_card)')

    test('Should return the createdPayment obj')

    test('Should send axios response error correctly formatted')

    test('Should send axios request error correctly formatted')

    test('Should send error returned by builPaymentRequest')

    test('Should send unexpectedError')

  })
  
  describe('getAuthToken', () => {

    test('Should call axios with the right auth data')

    test('Should return the token formatted for instant use')

    test('Should send response error')

    test('Should send request error')

    test('Should send unexpectedError')

  })

  describe('getLocalXps', () => {
    
    test('Should return an object with the right xps')

    test('Should return empty object if xps not found')

  })
  
  describe('getRemoteExperiences', () => {
    
    test('Should call getAuthToken')

    test('Should call axios with the right method, headers and auth')

    test('Should return the array of found experiences')

    test('Should return response error')

    test('Should return request error')

    test('Should return unexpected error')

  })

})

function createOptionsObjects() {
  kampaCdMockPaymentOpts = {
    method: 'credit_card',
    paymentSuccess: 'https://kampamocha.com/payment/success',
    ...getKampaOptions(),
    ...getCardOptions()
  }
  unahCdMockPaymentOpts = {
    method: 'credit_card',
    paymentSuccess: 'https://unahil.com/payment/success',
    ...getUnahilOptions(),
    ...getCardOptions()
  }
  kampaPpMockPaymentOpts = {
    method: 'paypal',
    ...getKampaOptions()
  }
  unahPpMockPaymentOpts = {
    method: 'paypal',
    ...getUnahilOptions()
  }
}

function createPaymentRequestsObjects() {
  kampaCdMockPaymentReq = {
    intent: 'sale',
    payer: getCardRequest(),
    transactions: [{
      ammount: getRequestTransactionAmmount(969.97, 5),
      description: '2x Pretty Bangles, 1x Prettier Necklace'
    }],
  }
  kampaPpMockPaymentReq = {
    intent: 'sale',
    experience_profile_id: 'An-awesome-exp-id-kampamocha',
    payer: { payment_method: 'paypal' },
    transactions: [{
      ammount: getRequestTransactionAmmount(969.97, 5),
      description: '2x Pretty Bangles, 1x Prettier Necklace'
    }],
    redirect_urls: {
      return_url: 'https://kampamocha.com/payment/success',
      cancel_url: 'https://kampamocha.com/payment/failed'
    }
  }
  
  unahCdMockPaymentReq = {
    intent: 'sale',
    payer: getCardRequest(),
    transactions: [{
      ammount: getRequestTransactionAmmount(559),
      description: '4 nights at US$139.75 each.'
    }]
  }
  unahPpMockPaymentReq = {
    intent: 'sale',
    experience_profile_id: 'An-awesome-exp-id-unahil',
    payer: { payment_method: 'paypal' },
    transactions: [{
      ammount: getRequestTransactionAmmount(559),
      description: '4 nights at US$139.75 each.'
    }],
    redirect_urls: {
      return_url: 'https://unahil.com/payment/success',
      cancel_url: 'https://unahil.com/payment/failed'
    }
  }
}

function getCardOptions() {
  return {
    cardType: 'visa',
    cardNumber: '4929831878017100',
    cardExpireMonth: '02',
    cardExpireYear: '19',
    cardCvv2: '998',
    cardName: 'Cosme Fulanito'
  }
}

function getCardRequest() {
  return {
    payment_method: 'credit_card',
    funding_instruments: [{
      credit_card: {
        type: 'visa',
        number: '4929831878017100',
        expire_month: '02',
        expire_year: `2019`,
        cvv2: '998',
        first_name: 'Cosme',
        last_name: 'Fulanito'
      }
    }]
  }
}

function getKampaOptions() {
  return {
    store: 'kampamocha',
    products: [{
      name: 'Pretty Bangles',
      quantity: '2',
      price: '199.99'
    },{
      name: 'Prettier Necklace',
      quantity: '1',
      price: '569.99'
    }],
    subtotal: '969.97',
    shipping: '5',
  }
}

function getRequestTransactionAmmount(subtotal, shipping) {
  const total = subtotal + shipping
  return {
    currency: 'USD',
    total,
    details: {
      subtotal,
      shipping
    }
  }
}

function getUnahilOptions() {
  return {
    store: 'unahil',
    nightPrice: '139.75',
    nights: '4',
    subtotal: '559',
  }
}
