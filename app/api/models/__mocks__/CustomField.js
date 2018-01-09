const CustomField = require.requireActual('../CustomField')

const MockedCustomField = jest.fn()
MockedCustomField.bind(CustomField)

module.exports = MockedCustomField
