const paypalCtrl = require('../../paypalCtrl')

jest.mock('axios')
const axios = require('axios')

describe('paypalCtrl', () => {
  const actualGetAuthToken = paypalCtrl.getAuthToken

  beforeEach(() => {
    paypalCtrl.getAuthToken = jest.fn(() => new Promise((resolve, reject) => { 
      resolve('Bearer heythisistoken') 
    }))
  })

  afterEach(() => {
    paypalCtrl.getAuthToken = actualGetAuthToken
  })

  describe('createExperience', () => {
    let requestBodyToSend
    
    beforeEach(() => {
      axios.post = jest.fn((url, options) => new Promise((resolve, reject) => {
        resolve({ data: { name: 'new exp', id: 'newexpid' } })
      }))

      requestBodyToSend = {
        name: 'this is the sent name',
        id: 'heyhey'
      }
    })
    
    test('Should call this.getToken', async () => {
      const experience = await paypalCtrl.createExperience(requestBodyToSend)

      expect(paypalCtrl.getAuthToken.mock.calls.length).toBe(1)
    })

    test('Should call axios with correct options and sent body', async () => {
      const expectedOptions = {
        data: requestBodyToSend,
        headers: {
          'Content-Type': 'application/JSON',
          'Authorization': 'Bearer heythisistoken'
        }
      }

      const experience = await paypalCtrl.createExperience(requestBodyToSend)

      const axiosUrl     = axios.post.mock.calls[0][0]
      const axiosOptions = axios.post.mock.calls[0][1]
      expect(axios.post.mock.calls.length).toBe(1)
      expect(axiosUrl).toBe('https://api.sandbox.paypal.com/v1/payment-experience/web-profiles')
      expect(axiosOptions).toEqual(expectedOptions)
    })

    test('Should return the created experience', async () => {
      const expectedExperience = { name: 'new exp', id: 'newexpid' }
      const experience = await paypalCtrl.createExperience(requestBodyToSend)

      expect(experience).toEqual(expectedExperience)
    })

    test('Should throw axios response error', async () => {
      axios.post = jest.fn(() => new Promise((resolve, reject) => {
        const resError = new Error('Faked Error')
        resError.response = {
          data: 'why do you care',
          headers: { 'header1': 'someinfo' },
          status: 500
        }
        reject(resError)
      }))

      try {
        await paypalCtrl.createExperience(requestBodyToSend)
        expect(1).toBe(0)
      } catch (e) {
        expect(e.message).toBe('Response error')
        expect(e.response).toEqual({
          data: 'why do you care',
          headers: { 'header1': 'someinfo' },
          status: 500
        })
      }
    })

    test('Should throw axios request error', async () => {
      axios.post = jest.fn(() => new Promise((resolve, reject) => {
        const resError = new Error('Faked Error')
        resError.request = 'BADBADBAD'
        reject(resError)
      }))

      try {
        await paypalCtrl.createExperience(requestBodyToSend)
        expect(1).toBe(0)
      } catch (e) {
        expect(e.message).toBe('Error on request')
        expect(e.request).toBe('BADBADBAD')
      }
    })

    test('Should throw unexpected eror', async () => {
      axios.post = jest.fn(() => new Promise((resolve, reject) => {
        reject(new Error('Faked Error'))
      }))

      try {
        await paypalCtrl.createExperience(requestBodyToSend)
        expect(1).toBe(0)
      } catch (e) {
        expect(e.message).toBe('Faked Error')
      }
    })

  })

  describe('createPayment', () => {
    let requestBodyToSend

    beforeEach(() => {
      axios.post = jest.fn((url, options) => new Promise((resolve, reject) => {
        resolve({ data: { name: 'new payment', id: 'newpayment' } })
      }))
      paypalCtrl.getAuthToken = jest.fn(() => new Promise((resolve, reject) => { resolve('Bearer heythisistoken') }))

      requestBodyToSend = {
        name: 'this is the sent name'
      }
    })

    test('Should call get token', async () => {
      const payment = await paypalCtrl.createPayment(requestBodyToSend)

      expect(paypalCtrl.getAuthToken.mock.calls.length).toBe(1)
    })

    test('Should call axios with correct options and sent body', async () => {
      const expectedOptions = {
        data: requestBodyToSend,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer heythisistoken'
        }
      }
      const payment = await paypalCtrl.createPayment(requestBodyToSend)

      const axiosUrl = axios.post.mock.calls[0][0]
      const axiosOptions = axios.post.mock.calls[0][1]
      expect(axios.post.mock.calls.length).toBe(1)
      expect(axiosUrl).toBe('https://api.sandbox.paypal.com/v1/payments/payment')
      expect(axiosOptions).toEqual(expectedOptions)
    })

    test('Should return the created payment', async () => {
      const expectedPayment = { name: 'new payment', id: 'newpayment' }
      const payment = await paypalCtrl.createPayment(requestBodyToSend)

      expect(payment).toEqual(expectedPayment)
    })

    test('Should throw axios response error', async () => {
      axios.post = jest.fn(() => new Promise((resolve, reject) => {
        const resError = new Error('Faked Error')
        resError.response = {
          data: 'why do you care',
          headers: { 'header1': 'someinfo' },
          status: 500
        }
        reject(resError)
      }))

      try {
        await paypalCtrl.createPayment(requestBodyToSend)
        expect(1).toBe(0)
      } catch (e) {
        expect(e.message).toBe('Response error')
        expect(e.response).toEqual({
          data: 'why do you care',
          headers: { 'header1': 'someinfo' },
          status: 500
        })
      }
    })

    test('Should throw axios request error', async () => {
      axios.post = jest.fn(() => new Promise((resolve, reject) => {
        const resError = new Error('Faked Error')
        resError.request = 'BADBADBAD'
        reject(resError)
      }))

      try {
        await paypalCtrl.createPayment(requestBodyToSend)
        expect(1).toBe(0)
      } catch (e) {
        expect(e.message).toBe('Error on request')
        expect(e.request).toBe('BADBADBAD')
      }
    })

    test('Should throw unexpected error', async () => {
      axios.post = jest.fn(() => new Promise((resolve, reject) => {
        reject(new Error('Faked Error'))
      }))

      try {
        await paypalCtrl.createPayment(requestBodyToSend)
        expect(1).toBe(0)
      } catch (e) {
        expect(e.message).toBe('Faked Error')
      }
    })

  })
  
  describe('getAuthToken', () => {
    const env = Object.assign({}, process.env)

    beforeEach(() => {
      process.env.NODE_PAYPAL_CLIENT_ID = 'coolid'
      process.env.NODE_PAYPAL_CLIENT_SECRET = 'shhhhandwhispers'

      paypalCtrl.getAuthToken = actualGetAuthToken
      axios.post = jest.fn((url, options) => new Promise((resolve, reject) => {
        resolve({ data: { access_token: 'hellofrenimtoken' } })
      }))
    })

    test('Should call axios with correct options and auth data', async () => {
      const expectedOptions = {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        params: {  'grant_type': 'client_credentials' },
        auth: {
          username: 'coolid',
          password: 'shhhhandwhispers'
        }
      }
      const token = await paypalCtrl.getAuthToken()

      const axiosUrl = axios.post.mock.calls[0][0]
      const axiosOptions = axios.post.mock.calls[0][1]
      expect(axios.post.mock.calls.length).toBe(1)
      expect(axiosUrl).toBe('https://api.sandbox.paypal.com/v1/oauth2/token')
      expect(axiosOptions).toEqual(expectedOptions)
    })

    test('Should return the token formatted for instant use', async () => {
      const expectedToken = 'Bearer hellofrenimtoken'
      const token = await paypalCtrl.getAuthToken()

      expect(token).toBe(expectedToken)
    })

    test('Should send axios response error', async () => {
      axios.post = jest.fn(() => new Promise((resolve, reject) => {
        const resError = new Error('Faked Error')
        resError.response = {
          data: 'why do you care',
          headers: { 'header1': 'someinfo' },
          status: 500
        }
        reject(resError)
      }))

      try {
        await paypalCtrl.getAuthToken()
        expect(1).toBe(0)
      } catch (e) {
        expect(e.message).toBe('Response error')
        expect(e.response).toEqual({
          data: 'why do you care',
          headers: { 'header1': 'someinfo' },
          status: 500
        })
      }
    })

    test('Should send axios request error', async () => {
      axios.post = jest.fn(() => new Promise((resolve, reject) => {
        const resError = new Error('Faked Error')
        resError.request = 'BADBADBAD'
        reject(resError)
      }))

      try {
        await paypalCtrl.getAuthToken()
        expect(1).toBe(0)
      } catch (e) {
        expect(e.message).toBe('Error on request')
        expect(e.request).toBe('BADBADBAD')
      }
    })

    test('Should send unexpected error', async () => {
      axios.post = jest.fn(() => new Promise((resolve, reject) => {
        reject(new Error('Faked Error'))
      }))

      try {
        await paypalCtrl.getAuthToken()
        expect(1).toBe(0)
      } catch (e) {
        expect(e.message).toBe('Faked Error')
      }
    })

  })
  
  describe('getRemoteExperiences', () => {

    beforeEach(() => {
      axios.get = jest.fn((url, options) => new Promise((resolve, reject) => {
        resolve({ data: [{ name: 'experience 1' }, {name: 'experience 2'}] })
      }))
    })
    
    test('Should call getAuthToken', async () => {
      await paypalCtrl.getRemoteExperiences()

      expect(paypalCtrl.getAuthToken.mock.calls.length).toBe(1)
    })

    test('Should call axios with the right method, headers and auth', async () => {
      const expectedOptions = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer heythisistoken'
        }
      }
      
      await paypalCtrl.getRemoteExperiences()

      const axiosUrl = axios.get.mock.calls[0][0]
      const axiosOptions = axios.get.mock.calls[0][1]
      expect(axios.get.mock.calls.length).toBe(1)
      expect(axiosUrl).toBe('https://api.sandbox.paypal.com/v1/payment-experience/web-profiles')
      expect(axiosOptions).toEqual(expectedOptions)
    })

    test('Should return the array of found experiences', async () => {
      const expectedExperiences = [{ name: 'experience 1' }, {name: 'experience 2'}]
      const experiences = await paypalCtrl.getRemoteExperiences()

      expect(experiences).toEqual(expectedExperiences)
    })

    test('Should return response error', async () => {
      axios.get = jest.fn(() => new Promise((resolve, reject) => {
        const resError = new Error('Faked Error')
        resError.response = {
          data: 'why do you care',
          headers: { 'header1': 'someinfo' },
          status: 500
        }
        reject(resError)
      }))

      try {
        await paypalCtrl.getRemoteExperiences()
        expect(1).toBe(0)
      } catch (e) {
        expect(e.message).toBe('Response error')
        expect(e.response).toEqual({
          data: 'why do you care',
          headers: { 'header1': 'someinfo' },
          status: 500
        })
      }
    })

    test('Should return request error', async () => {
      axios.get = jest.fn(() => new Promise((resolve, reject) => {
        const resError = new Error('Faked Error')
        resError.request = 'BADBADBAD'
        reject(resError)
      }))

      try {
        await paypalCtrl.getRemoteExperiences()
        expect(1).toBe(0)
      } catch (e) {
        expect(e.message).toBe('Error on request')
        expect(e.request).toBe('BADBADBAD')
      }
    })

    test('Should return unexpected error', async () => {
      axios.get = jest.fn(() => new Promise((resolve, reject) => {
        reject(new Error('Faked Error'))
      }))

      try {
        await paypalCtrl.getRemoteExperiences()
        expect(1).toBe(0)
      } catch (e) {
        expect(e.message).toBe('Faked Error')
      }
    })

  })

})
