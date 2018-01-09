const Text = require('../Text')

const { howManyKeys } = require('../../utils')
const { getValidText } = require('../../utils/validSchemas')

describe('Text model', () => {

  test('Should be valid', () => {
    const m = new Text( getValidText() )
    const v = m.validateSync()

    expect(v).toBeFalsy()
  })

  test('Should be invalid if no text', () => {
    const m = new Text({ })
    const v = m.validateSync()

    expect(howManyKeys(v.errors)).toBe(1)
    expect(v.errors.text).toBeTruthy()
  })

  test('Should be invalid if empty text', () => {
    const m = new Text({ text: '' })
    const v = m.validateSync()

    expect(howManyKeys(v.errors)).toBe(1)
    expect(v.errors.text).toBeTruthy()
  })

})