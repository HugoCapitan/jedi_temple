const paypalCtrl = require('../../paypalCtrl')

jest.mock('axios')
const axios = require('axios')

describe('paypalCtrl', () => {

  beforeEach(() => {
    axios.post = jest.fn((url, options) => new Promise((resolve, reject) => {
      let data
      if (url === 'https://api.sandbox.paypal.com/v1/oauth2/token') 
        data = 'hellothisistoken'
      if (url === 'https://api.sandbox.paypal.com/v1/payment-experience/web-profiles') 
        data = { name: 'new exp', id: 'newexpid' }
      if (url === 'https://api.sandbox.paypal.com/v1/payments/payment')
        data = { what: 'a payment object' }

      resolve({ data })
    }))
  })

  describe('createExperience', () => {
    
    beforeEach(() => {
      paypalCtrl.getAuthToken = jest.fn(() => 'Bearer: heythisistoken')
    })
    
    test('Should call getToken', async () => {
      const token = await paypalCtrl.createExperience({})
    })

    test('Should call axios with correct options and sent body')

    test('Should return the created experience')

    test('Should throw axios response error')

    test('Should throw axios request error')

    test('Should throw unexpected eror')

  })
  

  describe('createPayment', () => {

    test('Should call get token')

    test('Should call axios with correct options and sent body')

    test('Should return the created payment')

    test('Should throw axios response error')

    test('Should throw axios request error')

    test('Should throw unexpected error')

  })
  
  describe('getAuthToken', () => {

    test('Should call axios with correct options and auth data')

    test('Should return the token formatted for instant use')

    test('Should send axios response error')

    test('Should send axios request error')

    test('Should send unexpected error')

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
