const Client      = require('../models/Client')
const CustomField = require('../models/CustomField')
const HMProduct   = require('../models/HMProduct')
const Order       = require('../models/Order')
const Product     = require('../models/Product')
const Reservation = require('../models/Reservation')
const Store       = require('../models/Store')

module.exports = () => {
  const findPromises = []

  findPromises.push(
    Client.remove({}).exec(), 
    CustomField.remove({}).exec(),
    HMProduct.remove({}).exec(),
    Order.remove({}).exec(),
    Product.remove({}).exec(),
    Reservation.remove({}).exec(),
    Store.remove({}).exec()
  )

  Promise.all(findPromises)
  .then(removed => {
    console.log('Database clean.')
  })
}
