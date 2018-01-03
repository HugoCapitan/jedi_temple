const CustomField = require('../CustomField')
const Filter = require('../Filter')
const howManyKeys = require('../../utils').howManyKeys

describe('Filter Model', () => {
  let validFilter, validCustomField
  
  beforeEach(() => { setupTest() })
  
  test('Should be valid', () =>{
    const m = new Filter(validFilter)
    const v = m.validateSync()

    expect(v).toBeFalsy()
  })

  test('Should be invalid if empty custom_id', () => {
    const m = new Filter({ })
    const v = m.validateSync()

    expect(howManyKeys(v.errors)).toBe(1)
    expect(v.errors.custom_id).toBeTruthy()
  })

  test('Should be invalid if wrong custom_id', () => {
    const m = new Filter({ custom_id: 'anonexistingid' })
    const v = m.validateSync()

    expect(howManyKeys(v.errors)).toBe(1)
    expect(v.errors.custom_id).toBeTruthy()
  })

  function setupTest() {
    validCustomField = new CustomField({
      name: 'String CustomField',
      show: true,
      type: 'string',
      values: ['A value', 'Another Value']
    })

    validFilter = {
      custom_id: validCustomField._id
    }
  }
})
