const Picture = require.requireActual('../Picture')

const MockedPicture = jest.fn()
MockedPicture.bind(Picture)

module.exports = MockedPicture
