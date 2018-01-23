const clientCtrl = require('../../customFieldCtrl')

describe('clientCtrl -> create', () => {

  test('Should instantiate new Client with received body')

  test('Should call save on the new Client')

  test('Should return the new Client after saved')

  test('Should throw a ValidationError')

  test('Should throw a DuplicatedError')

  test('Should throw a UnexpectedError')

})

describe('clientCtrl -> remove', () => {
  
  test('Should call Client.findByIdAndRemove')

  test('Should return the deleted Client')

  test('Should throw a NotFoundError')

  test('Should throw a UnexpectedError')

})

describe('clientCtrl -> update', () => {

  test('Should call Client.findByIdAndUpdate')

  test('Should call Client.findById and return the found document')

  test('Should throw a ValidationError')

  test('Should throw a DuplicatedError')
  
  test('Should throw a NotFoundError')

  test('Should throw a UnexpectedError')

}) 