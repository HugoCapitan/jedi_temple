const CustomField = require('../CustomField')
const HMMaterial  = require('../HMMaterial')
const HMProduct   = require('../HMProduct')
const Product     = require('../Product')
const howManyKeys = require('../../utils').howManyKeys

describe('Normal Product Model', () => {
  let validProduct

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

    expect(howManyKeys(v.errors)).toBe(2)

    expect(v.errors.name).toBeTruthy()
    expect(v.errors.stock).toBeTruthy()
  })


  test('Should be invalid if wrong images', () => {
    const malformedImage = {
      url: 999.99,
      x: 50,
      y: 50
    }
    const malformedProduct = Object.assign({}, correctProduct, { images: [malformedImage] })

    const m = new Product(malformedProduct)
    const v = m.validateSync()

    expect(howManyKeys(v.errors)).toBe(3)
    expect(v.errors['images.0.url']).toBeTruthy()
    expect(v.errors['images.0.x']).toBeTruthy()
    expect(v.errors['images.0.y']).toBeTruthy()
  })

  test('Should be invalid if required customs missing: price, description')

  function setupTest() {
    correctCustom = new CustomField({
      name: 'Price',
      show: true,
      type: 'number',
      min: 'auto',
      max: 'auto',
      unit: 'US$ ',
      unit_place: 'before'
    })

    correctImage = {
      url: 'someurl.com/image.png',
      x: '50%',
      y: '2px'
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
      images: [correctImage],
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