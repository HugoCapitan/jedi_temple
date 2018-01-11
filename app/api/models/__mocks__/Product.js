const Product = require.requireActual('../Product')

const MockedProduct = jest.fn()
MockedProduct.bind(Product)

module.exports = MockedProduct
