const fs   = require('fs')
const path = require('path')

const Client      = require('../models/Client')
const CustomField = require('../models/CustomField')
const HMProduct   = require('../models/HMProduct')
const Order       = require('../models/Order')
const Product     = require('../models/Product')
const Reservation = require('../models/Reservation')
const Store       = require('../models/Store')

module.exports = async () => {
  try {
    const clients = JSON.parse(fs.readFileSync(
      path.resolve(__dirname, 'mocked_data/clients.json'), { encoding: 'utf-8' }
    ))
    const customs = JSON.parse(fs.readFileSync(
      path.resolve(__dirname, 'mocked_data/customs.json'), { encoding: 'utf-8' }
    ))
    const handmades = JSON.parse(fs.readFileSync(
      path.resolve(__dirname, 'mocked_data/handmades.json'), { encoding: 'utf-8' }
    ))
    // const orders = JSON.parse(fs.readFileSync(
    //   path.resolve(__dirname, 'mocked_data/orders.json'), { encoding: 'utf-8' }
    // ))
    // const products = JSON.parse(fs.readFileSync(
    //   path.resolve(__dirname, 'mocked_data/products.json'), { encoding: 'utf-8' }
    // ))
    // const reservations = JSON.parse(fs.readFileSync(
    //   path.resolve(__dirname, 'mocked_data/reservations.json'), { encoding: 'utf-8' }
    // ))
    // const stores = JSON.parse(fs.readFileSync(
    //   path.resolve(__dirname, 'mocked_data/clients.json'), { encoding: 'utf-8' }
    // ))
  
    const saves = []
    for (const client of clients)     { saves.push(new Client(client).save()) }
    for (const custom of customs)     { saves.push(new CustomField(custom).save()) }
    for (const handmade of handmades) { saves.push(new HMProduct(handmade).save()) }

    await Promise.all(saves)
    
    console.log('Mocked data.')

    return false
  } catch (e) {
    console.log(e)
  }
}
