const mongoose = require('mongoose')
const Schema = mongoose.Schema

const slugify = require('../utils').slugify

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