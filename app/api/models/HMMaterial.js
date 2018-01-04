const mongoose = require('mongoose')
const Schema = mongoose.Schema

const { slugify } = require('../utils')

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
  var currentDate = new Date()

  this.updated_at = currentDate

  if (!this.created_at) 
    this.created_at = currentDate

  this.slug = slugify(`${this.product}-${this.name}`)

  next()
})

const HMMaterial = mongoose.model('HMMaterial', HMMaterialSchema)

module.exports = HMMaterial
