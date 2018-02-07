const paypalCtrl = require('../../paypalCtrl')

jest.mock('axios')
const axios = require('axios')

describe('paypalCtrl', () => {

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
