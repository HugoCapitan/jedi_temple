const Store = require.requireActual('../Store')

const MockedStore = jest.fn()
MockedStore.bind(Store)

module.exports = MockedStore
