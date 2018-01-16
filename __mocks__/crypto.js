const crypto = require.requireActual('crypto')

const MockedCrypto = {}

Object.assign(MockedCrypto, crypto)

module.exports = MockedCrypto
