const mongoose = require('mongoose')
const Schema = mongoose.Schema

const utils = require('../utils')
const slugify = utils.slugify

const HMMaterialSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  slug: {
    type: String,
    unique: true
  },
  price: {
    type: Number,
    required: true
  }
})

const HMProductSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  slug: {
    type: String,
    unique: true
  },
  materials: {
    type: [HMMaterialSchema]
  },
  created_at: Date,
  updated_at: Date
})

HMProductSchema.pre('save', (next) => {
  const currentDate = new Date

  this.updated_at = currentDate
  if (!this.created_at) this.created_at = currentDate

  this.slug = slugify(this.name)

  next()
})

const HMProduct = mongoose.model('HMProduct', HMProductSchema)

module.exports = HMProduct