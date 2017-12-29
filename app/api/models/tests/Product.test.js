const CustomField = require('../CustomField')
const HMMaterial  = require('../HMMaterial')
const HMProduct   = require('../HMProduct')
const Product     = require('../Product')
const howManyKeys = require('../../utils').howManyKeys

describe('Normal Product Model', () => {
  let correctCustom
  let correctImage
  let correctHMMaterial
  let correctHMProduct
  let correctProduct
  let correctHandmadeProduct

  beforeEach(() => { setupTest() })

  test('Should be fine', () => {
    const m = new Product(correctProduct)
    const v = m.validateSync()

    expect(v).toBeFalsy()
  })

  test('Should be invalid if empty: name, stock', () => {
    const wrongProduct = Object.assign({}, correctProduct, {name: undefined, stock: undefined})

    const m = new Product(wrongProduct)
    const v = m.validateSync()

    expect(howManyKeys(v['errors'])).toBe(2)

    expect(v.errors.name).toBeTruthy()
    expect(v.errors.stock).toBeTruthy()
  })

  test('Should be invalid if no handmade and no description', () => {

  })

  test('Should be invalid if no handmade and no custom for price', () => {

  })

  test('Should be invalid if Handmade and customs at same time', () => {

  })

  test('Should be invalid if wrong images', () => {

  })

  test('Should be invalid if wrong handmade', () => {

  })

  function setupTest() {
    correctCustom = new CustomField({
      name: 'String CustomField',
      show: true,
      type: 'string',
      values: ['A value', 'Another Value']
    })

    correctImage = {
      url: 'someurl.com/image.png',
      x: '50%',
      y: '20%'
    }

    correctHMProduct = new HMProduct({
      name: 'Bracelet'
    })

    correctHMMaterial = new HMMaterial({
      name: 'Gold',
      price: 599.99,
      product: correctHMProduct._id
    })

    correctProduct = {
      name: 'Some product',
      stock: '20',
      description: 'Some product description',
      customs: [{
        custom_id: correctCustom._id,
        value: 'A value'
      }]
    }

    correctHandmadeProduct = 
      Object.assign(
        {}, 
        correctProduct, 
        {
          customs: undefined,
          description: undefined,
          handmade_id: correctHMMaterial._id 
        }
      )
  }
})