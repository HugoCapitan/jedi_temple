const Order = require.requireActual('../Order')

const MockedOrder = jest.fn()
MockedOrder.bind(Order)

module.exports = MockedOrder
