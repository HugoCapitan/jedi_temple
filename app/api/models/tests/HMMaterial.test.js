const HMMaterial = require('../HMMaterial')
const HMProduct = require('../HMProduct')

describe('HMMaterial Model', () => {
  let correctHMMaterial, 
      correctHMProduct, 
      p

  beforeEach(() => { setupTest() })

  test('Should be fine', () => {
    const m = new HMMaterial(correctHMMaterial)
    const v = m.validateSync()

    expect(v).toBeFalsy()
  })

  test('Should be invalid if empty: name, product or price', () => {
    const m = new HMMaterial({})
    const v = m.validateSync()

    expect(v.errors['name']).toBeTruthy()
    expect(v.errors['price']).toBeTruthy()
    expect(v.errors['product']).toBeTruthy()    
  })

  test('Should be invalid if invalid product_id reference', () => {
    const invalidHMMaterial = Object.assign({}, correctHMMaterial, { product: 'somefalseid' })
    
    const m = new HMMaterial(invalidHMMaterial)
    const v = m.validateSync()

    expect(v.errors['product']).toBeTruthy()    
  })

  function setupTest () {
    correctHMProduct = {
      name: 'Bracelet'
    }
    p = new HMProduct(correctHMProduct)

    correctHMMaterial = {
      name: 'Gold',
      price: 599.99,
      product: p._id
    }
  }
})