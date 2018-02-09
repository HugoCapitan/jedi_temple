const moment = require('moment')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const Client      = require('../models/Client')
const CustomField = require('../models/CustomField')
const HMProduct   = require('../models/HMProduct')
const Order       = require('../models/Order')
const Picture     = require('../models/Picture')
const Product     = require('../models/Product')
const Reservation = require('../models/Reservation')
const Text        = require('../models/Text')

module.exports = {
  getValidAddress: getValidAddress,
  getValidClient: getValidClient,
  getValidHMProduct: getValidHMProduct,
  getValidImage: getValidImage,
  getValidNumberCustom: getValidNumberCustom,
  getValidOrder: getValidOrder,
  getValidPicture: getValidPicture,
  getValidProduct: getValidProduct,
  getValidReservation: getValidReservation,
  getValidStringCustom: getValidStringCustom,
  getValidStore: getValidStore,
  getValidText: getValidText
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
  return {
    name: 'Some Name',
    email: 'some@email.com',
    password: 'arealhardpassword',
    addresses: [getValidAddress()],
    store: 'Kampamocha',
    orders: [new ObjectId('fafafafafafafafafafafafa')],
    wishlist: [new ObjectId('afafafafafafafafafafafaf')],
    reservations: [new ObjectId('0f0f0f0f0f0f0f0f0f0f0f0f')]
  }
}

function getValidHMProduct() {
  const materialId = new ObjectId('aaafffaaafffaaafffaaafff')
  return { 
    name: 'Bracelet',
    store: 'Kampamocha',
    materials: [{
      _id: materialId,
      material_name: '24K Gold',
      material_price: 999.99
    }],
    models: [{
      model_name: 'A Gold Model',
      material_id: materialId
    }]
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
    store: 'Kampamocha',
    unit_place: 'after'
  }
}

function getValidOrder() {
  return {
    email: 'some@mail.com',
    status: 'Awaiting Payment',
    payment_method: 'paypal',
    payment_id: 'somepaypalid',
    products: [{ 
      code: new ObjectId('0a0a0a0a0a0a0a0a0a0a0a0a'),
      quantity: 2,
      is_populated: false
    },{
      code: new ObjectId('a0a0a0a0a0a0a0a0a0a0a0a0'),
      quantity: 1,
      is_populated: false
    }],
    store: 'Kampamocha',
    shipping: 15,
    billing_address: getValidAddress(),
    shipping_address: getValidAddress()
  }
}

function getValidPicture() {
  return {
    url: '/dist/picture.png',
    store: 'Kampamocha'
  }
}

function getValidProduct() {
  return {
    name: 'Some product',
    stock: '20',
    price: 599.99,
    description: 'Some product description',
    store: 'Kampamocha',
    images: [ getValidImage() ],
    customs: [{
      custom_id: new ObjectId('000aaa000aaa000aaa000aaa'),
      value: 'A value'
    }]
  }
}

function getValidReservation() {
  return {
    email: 'some@mail.com',
    plan: 'short',
    status: 1,
    store: 'Unahil',
    arrive_date: moment().add('1', 'days').toDate(),
    departure_date: moment().add('1', 'weeks').toDate(),
    night_price: 499.99
  }
}

function getValidStore() {
  return {
    name: 'The Store Baby',
    calendar: {
      nearest_available_date: 7,
      furthest_available_date: 120,
      maximum_reservation: 45
    }
  }
}

function getValidStringCustom() {
  return {
    name: 'String CustomField',
    show: true,
    store: 'Kampamocha',
    type: 'string',
    values: [ { value: 'A value' }, { value: 'Another Value' } ]
  }
}

function getValidText() {
  return {
    text: 'This is some random text',
    store: 'Kampamocha'
  }
}