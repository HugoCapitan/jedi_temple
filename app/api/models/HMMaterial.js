const mongoose = require('mongoose')
const Schema = mongoose.Schema

const slugify = require('../utils').slugify

const HMMaterialSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    unique: true
  },
  price: {
    type: Number,
    required: true
  },
  product: {
    type: mongoose.SchemaTypes.ObjectId,
    rel: 'HMProduct',
    required: true
  }
})

HMMaterialSchema.pre('save', (next) => {
  next()
})

const HMMaterial = mongoose.model('HMMaterial', HMMaterialSchema)

module.exports = HMMaterial
