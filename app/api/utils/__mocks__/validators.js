const validators = jest.genMockFromModule('../validators')

function hasRequiredCustoms (val) {
  console.log('Mock')
  return true
}

validators.hasRequiredCustoms = hasRequiredCustoms

module.exports = validators
