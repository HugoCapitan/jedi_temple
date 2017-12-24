const HMProduct = require('../HMProduct')

describe('HMProduct Model', () => {
  let correctHMProduct, correctHMMaterial

  beforeEach(() => { setupTest() })

  test('Should be invalid if empty: name, materials name, materials price', () => {
    const wrongHMProduct = { materials: [{}] }

    const m = new HMProduct(wrongHMProduct)
    const v = m.validateSync()

    expect(v.errors['name']).toBeTruthy()
    expect(v.errors['materials.0.name']).toBeTruthy()
    expect(v.errors['materials.0.price']).toBeTruthy()
  })

  test('Should be fine', () => {
    Object.assign(correctHMProduct, { materials: [correctHMMaterial] })

    const m = new HMProduct(correctHMProduct)
    const v = m.validateSync()

    expect(v).toBeFalsy()
  })

  function setupTest() {
    correctHMProduct = {
      name: 'Bracelet'
    }
    correctHMMaterial = {
      name: 'Gold',
      price: 559.99
    }
  }
})