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
  const product = new Product( getValidProduct() )
  const order = new Order( getValidOrder() )

  return {
    name: 'Some Name',
    email: 'some@email.com',
    password: 'arealhardpassword',
    addresses: [getValidAddress()],
    orders: [new ObjectId('fafafafafafafafafafafafa')],
    wishlist: [new ObjectId('afafafafafafafafafafafaf')]
  }
}

function getValidHMProduct() {
  const product = new Product( getValidProduct() )

  return { 
    name: 'Bracelet',
    materials: [{
      name: '24K Gold',
      price: 999.99,
      models: [
        product._id
      ]
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
    unit_place: 'after'
  }
}

function getValidOrder() {
  const product = new Product( getValidProduct() )

  return {
    email: 'some@mail.com',
    status: 'Awaiting Payment',
    products: [{ 
      code: new ObjectId('0a0a0a0a0a0a0a0a0a0a0a0a'),
      quantity: 2,
      is_populated: false
    },{
      code: new ObjectId('a0a0a0a0a0a0a0a0a0a0a0a0'),
      quantity: 1,
      is_populated: false
    }],
    shipping: 15,
    billing_address: getValidAddress(),
    shipping_address: getValidAddress()
  }
}

function getValidPicture() {
  return {
    url: '/dist/picture.png'
  }
}

function getValidProduct() {
  const validCustom = new CustomField( getValidNumberCustom() )

  return {
    name: 'Some product',
    stock: '20',
    price: 599.99,
    description: 'Some product description',
    images: [ getValidImage() ],
    customs: [{
      custom_id: validCustom._id,
      value: 'A value'
    }]
  }
}

function getValidReservation() {
  return {
    email: 'some@mail.com',
    plan: 'short',
    status: 1,
    arrive_date: moment().add('1', 'days').toDate(),
    departure_date: moment().add('1', 'weeks').toDate()
  }
}

function getValidStore() {
  const product     = new Product( getValidProduct() )
  const text        = new Text( getValidText() )
  const picture     = new Picture( getValidPicture() )
  const customField = new CustomField( getValidNumberCustom() )
  const order       = new Order( getValidOrder() )
  const client      = new Client( getValidClient() )
  const reservation = new Reservation( getValidReservation() )

  return {
    name: 'The Store Baby',
    products: [ product._id ],
    texts: [ text._id ],
    pictures: [ picture._id ],
    customs: [ customField._id ],
    orders: [ order._id ],
    clients: [ client._id ],
    reservations: [ reservation._id ],
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
    type: 'string',
    values: [ { value: 'A value' }, { value: 'Another Value' } ]
  }
}

function getValidText() {
  return {
    text: 'This is some random text'
  }
}