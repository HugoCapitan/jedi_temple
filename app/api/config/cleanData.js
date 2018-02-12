const Admin       = require('../models/Admin')
const Client      = require('../models/Client')
const CustomField = require('../models/CustomField')
const HMProduct   = require('../models/HMProduct')
const Order       = require('../models/Order')
const Product     = require('../models/Product')
const Reservation = require('../models/Reservation')
const Store       = require('../models/Store')

module.exports = async () => {
  const findPromises = []

  findPromises.push(
    Admin.remove({}).exec(),
    Client.remove({}).exec(), 
    CustomField.remove({}).exec(),
    HMProduct.remove({}).exec(),
    Order.remove({}).exec(),
    Product.remove({}).exec(),
    Reservation.remove({}).exec(),
    Store.remove({}).exec()
  )

  await Promise.all(findPromises).catch(e => { console.log(e); throw e })

  console.log('Database clean.')
  
  return false
}
