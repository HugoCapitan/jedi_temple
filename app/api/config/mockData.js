const fs     = require('fs')
const moment = require('moment')
const path   = require('path')

const Admin       = require('../models/Admin')
const Client      = require('../models/Client')
const CustomField = require('../models/CustomField')
const HMProduct   = require('../models/HMProduct')
const Message     = require('../models/Message')
const Order       = require('../models/Order')
const Product     = require('../models/Product')
const Reservation = require('../models/Reservation')
const Store       = require('../models/Store')
const Top         = require('../models/Top')

module.exports = async () => {
  try {
    const clients = require('./mocked_data/clients')
    const customs = require('./mocked_data/customs')
    const handmades = require('./mocked_data/handmades')
    const messages = require('./mocked_data/messages')
    const orders = require('./mocked_data/orders')
    const products = require('./mocked_data/products')
    const halfReservations = require('./mocked_data/reservations')
    const stores = require('./mocked_data/stores')
    const tops = require('./mocked_data/tops')

    const instancedCustoms = customs.map(custom => new CustomField(custom))
    for (const product of products) {
      product.customs = instancedCustoms.reduce((productCustoms, custom, index) => {
        if (custom.store === product.store)
          productCustoms.push({
            custom_id: custom._id,
            value: custom.type === 'string' ? custom.values[0]._id : '100'
          })

        return productCustoms
      }, [])
    }

    const instancedProducts = products.map(product => new Product(product))

    const firstSaves = []
    for (const custom of instancedCustoms)   { firstSaves.push(custom.save()) }
    for (const product of instancedProducts) { firstSaves.push(product.save()) }
    for (const store of stores)              { firstSaves.push(new Store(store).save()) }
    
    await Promise.all(firstSaves)

    for (const order of orders) {
      order.products = instancedProducts.reduce((storeProds, product) => {
        if (product.store === order.store) 
          storeProds.push({ code: product._id, quantity: 1 })
        
        return storeProds
      }, [])
    }
  
    const reservations = halfReservations.map((reservation, index) => {
      const arrive_date    = moment().add((index * 4 + 2), 'days').toDate()
      const departure_date = moment(arrive_date).add(3, 'days').toDate()
      return { ...reservation, arrive_date, departure_date }
    })

    const saves = []
    for (const client of clients)            { saves.push(new Client(client).save()) }
    for (const handmade of handmades)        { saves.push(new HMProduct(handmade).save()) }
    for (const message of messages)          { saves.push(new Message(message).save()) }
    for (const order of orders)              { saves.push(new Order(order).save()) }
    for (const reservation of reservations)  { saves.push(new Reservation(reservation).save()) }
    for (const top of tops)                  { saves.push(new Top(top).save()) }

    saves.push( new Admin({ email: 'admin@unahil.com', password: 'theadminpassword' }).save() )

    await Promise.all(saves)
    
    console.log('Mocked data.')
    return false
  } catch (e) {
    console.log(e)
    throw e
  }
}
