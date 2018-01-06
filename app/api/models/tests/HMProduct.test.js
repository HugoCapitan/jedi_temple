const HMProduct = require('../HMProduct')

const { getValidHMProduct } = require('../../utils/models')

describe('HMProduct Model', () => {
  let correctHMProduct

  beforeEach(() => { setupTest() })

  test('Should be valid', () => {
    const m = new HMProduct(correctHMProduct)
    const v = m.validateSync()

    expect(v).toBeFalsy()
  })

  test('Should be invalid if empty name')

  test('Should be invalid if product missing important customs: model, material')

  test('Should be invalid if material missing price or name')

  function setupTest() {
    correctHMProduct = getValidHMProduct()
  }
})