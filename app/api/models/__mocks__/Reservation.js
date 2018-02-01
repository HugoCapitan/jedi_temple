const Reservation = require.requireActual('../Reservation')

const MockedReservation = jest.fn()
MockedReservation.bind(Reservation)

module.exports = MockedReservation
