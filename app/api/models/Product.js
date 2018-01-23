const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const uCommons = require('../utils')
// const { hasRequiredCustoms } = require('../utils/validators')

const CustomSchema = require('./schemas/CustomSchema')
const ImageSchema = require('./schemas/ImageSchema')

const ProductSchema = new Schema({
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
  stock: {
    type: Number,
    required: true
  },
  description: String,
  images: [ImageSchema],
  customs: {
    type: [CustomSchema],
  },
  created_at: Date,
  updated_at: Date
})

ProductSchema.pre('save', function(next) {
  var currentDate = new Date()

  this.updated_at = currentDate

  if (!this.created_at) 
    this.created_at = currentDate

  this.slug = uCommons.slugify(this.name)

  next()
})

const Product = mongoose.model('Product', ProductSchema)

module.exports = Product
