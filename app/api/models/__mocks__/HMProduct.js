const HMProduct = require.requireActual('../HMProduct')

const MockedHMProduct = jest.fn()
MockedHMProduct.bind(HMProduct)

module.exports = MockedHMProduct
