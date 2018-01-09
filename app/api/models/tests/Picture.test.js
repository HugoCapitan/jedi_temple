const Picture = require('../Picture')

const { howManyKeys } = require('../../utils')
const { getValidPicture } = require('../../utils/validSchemas')

describe('Picture model', () => {
  
  test('Should be valid', () => {
    const m = new Picture( getValidPicture() )
    const v = m.validateSync()

    expect(v).toBeFalsy()
  })

  test('Should be invalid if missing url', () => {
    const m = new Picture({ })
    const v = m.validateSync()

    expect(howManyKeys(v.errors)).toBe(1)
    expect(v.errors.url).toBeTruthy()
  })

  test('Should be invalid if url not ending in picture format', () => {
    const m = new Picture({ url: 'someinvalidurl' })
    const v = m.validateSync()

    expect(howManyKeys(v.errors)).toBe(1)
    expect(v.errors.url).toBeTruthy()
  })

})