const paypalCtrl = require('../../paypalCtrl')

jest.mock('axios')
const axios = require('axios')

describe('paypalCtrl', () => {

  describe('buildPaymentRequest', () => {
    let kampaCdMockPaymentOpts, kampaPpMockPaymentOpts,
        unahCdMockPaymentOpts, unahPpMockPaymentOpts,
        kampaCdPaymentReq, kampaPpPaymentReq,
        unahCdPaymentReq, kampaPpPaymentReq

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

function createCdOptionsObjects() {
  kampaCdMockPaymentOpts = {
    method: 'credit_card',
    paymentSuccess: 'https://kampamocha.com/payment/success',
    ...getKampaOptions(),
    ...getCardOptions()
  }
  unahCdMockPaymentOpts = {
    method: 'credit_card',
    ...getUnahilOptions(),
    paymentSuccess: 'https://unahil.com/payment/success',
    ...getCardOptions()
  }
}

function createPpOtionsObjects() {
  kampaPpMockPaymentOpts = {
    method: 'paypal',
    store: 'unahil',

  }
  unahPpMockPaymentOpts = {
    method: 'credit_card',
    store: 'unahil',
    nightPrice: '139.75',
    nights: '4',
    subtotal: '559',
  }
}

function createPaymentRequestsObjects() {

}

function getCardOptions() {
  return {
    cardType: 'visa',
    cardNumber: "4929831878017100",
    cardExpireMonth: "02",
    cardExpireYear: "19",
    cardCvv2: "998",
    cardName: "Cosme Fulanito"
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

function getUnahilOptions() {
  return {
    store: 'unahil',
    nightPrice: '139.75',
    nights: '4',
    subtotal: '559',
  }
}
