const paypalCtrl = require('../paypalCtrl')

jest.mock('axios')
const axios = require('axios')

describe('paypalCtrl', () => {

  describe('buildPaymentRequest', () => {

    test('Should return a correct paypal payment obj')

    test('Should return an error malformed paymentForm (method=paypal)')

    test('Should return an error malformed paymentForm (method=credit_card)')
    
    test('Should return an error -> URLS not found')

    test('Should return an error -> Experience not found')

  })

  describe('createPaymentEndpoint', () => {

    test('Should call get token')

    test('Should call buildPayment')

    test('Should call axios with correct method and options')

    test('Should check on response for redirect url and cal res.redirect (paypal)')

    test('Should check on response for redirect url and cal res.redirect (credit_card)')

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
    
  })
  
  describe('getRemoteExperiences', () => {
    
  })
  

})
