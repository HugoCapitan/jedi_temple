const HMProduct = require('../HMProduct')

describe('HMProduct Model', () => {
  let correctHMProduct

  beforeEach(() => { setupTest() })

  test('Should be invalid if empty: name', () => {
    const m = new HMProduct({})
    const v = m.validateSync()

    expect(v.errors['name']).toBeTruthy()
  })

  test('Should be fine', () => {
    const m = new HMProduct(correctHMProduct)
    const v = m.validateSync()

    expect(v).toBeFalsy()
  })

  function setupTest() {
    correctHMProduct = {
      name: 'Bracelet'
    }
  }
})