const shortUniqueId = require('short-unique-id')
const suid = new shortUniqueId()

const Address = require('../models/Address')
const Client = require('../models/Client')
const CustomField = require('../models/CustomField')
const HMProduct = require('../models/HMProduct')
const Order = require('../models/Order')
const Product = require('../models/Product')

module.exports = {
  createOrdercode(date) {
    return `${date.getDate}-${date.getMonth}-${date.getFullYear}-${suid.randomUUID(8)}`
  },
  getValidAddress: getValidAddress,
  getValidClient: getValidClient,
  getValidFilter: getValidFilter,
  getValidHMProduct: getValidHMProduct,
  getValidImage: getValidImage,
  getValidNumberCustom: getValidNumberCustom,
  getValidOrder: getValidOrder,
  getValidProduct: getValidProduct,
  getValidStringCustom: getValidStringCustom
}

function getValidAddress () {
  return {
    name: 'Some Name',
    email: 'some@mail.com',
    address_line_1: 'Address number etc',
    address_line_2: 'Appartment number',
    city: 'Maybe a mayor city',
    state: 'Who cares',
    country: 'PR',
    zip: '89231'
  }
}

function getValidClient() {
  const address1 = new Address( getValidAddress() )
  const product = new Product( getValidProduct() )
  const order = new Order( getValidOrder() )

  return {
    name: 'Some Name',
    email: 'some@email.com',
    password: 'arealhardpassword',
    addresses: [address1._id],
    orders: [order._id],
    wishlist: [product._id]
  }
}

function getValidFilter() {
  const validCustom = new CustomField( getValidStringCustom() )

  return {
    custom_id: validCustom._id
  }
}

function getValidHMProduct() {
  const validProduct1 = new Product( 
    Object.assign(getValidProduct(), { name: '24K Gold Bracelet' } )
  )
  
  return { 
    name: 'Bracelet' 
  }
}

function getValidImage() {
  return {
    url: 'someurl.com/image.png',
    x: '50%',
    y: '2px'
  }
}

function getValidNumberCustom() {
  return {
    name: 'Number CustomField',
    show: true,
    type: 'number',
    min: 'auto',
    max: '500',
    unit: 'cm',
    unit_place: 'after'
  }
}

function getValidOrder() {
  const address = new Address( getValidAddress() )
  const product = new Product( getValidProduct() )

  return {
    email: 'some@mail.com',
    status: 1,
    products: [{ 
      product_id: product._id,
      quantity: 5
    }],
    shipping: 15,
    billing_address: address._id,
    shipping_address: address._id
  }
}

function getValidProduct() {
  const validCustom = new CustomField( getValidNumberCustom() )

  return {
    name: 'Some product',
    stock: '20',
    description: 'Some product description',
    images: [ getValidImage() ],
    customs: [{
      custom_id: validCustom._id,
      value: 'A value'
    }]
  }
}

function getValidStringCustom() {
  return {
    name: 'String CustomField',
    show: true, 
    type: 'string',
    values: ['A value', 'Another Value']
  }
}