const axios = require.requireActual('axios')

const MockedAxios = {}

Object.assign(MockedAxios, axios)

module.exports = MockedAxios
