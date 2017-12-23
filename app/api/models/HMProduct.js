const mongoose = require('mongoose')
const Schema = mongoose.Schema

const HMMaterialSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  price: {
    type: Number,
    required: true
  }
})

const HMProductSchema = new Schema({
  Name: {
    type: String,
    required: true,
    unique: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  materials: {
    type: []
  }
})

HMProductSchema.pre('save', () => {
  
})

const HMProduct = mongoose.model('HMProduct', HMProductSchema)

module.exports = HMProduct