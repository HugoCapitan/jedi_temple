const CustomField = require('../CustomField')
const Filter = require('../Filter')
const howManyKeys = require('../../utils').howManyKeys

const { getValidFilter } = require('../../utils/validSchemas')

describe('Filter Model', () => {
  let validFilter
  
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
    validFilter = getValidFilter()
  }
})
