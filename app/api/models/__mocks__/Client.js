const Client = require.requireActual('../Client')

const MockedClient = jest.fn()
MockedClient.bind(Client)

module.exports = MockedClient
