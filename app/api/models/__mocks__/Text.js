const Text = require.requireActual('../Text')

const MockedText = jest.fn()
MockedText.bind(Text)

module.exports = MockedText
