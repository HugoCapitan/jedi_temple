const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const HMMaterial = require('./HMMaterial')

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
  stock: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required() {
      return !this.handmade
    }
  },
  images: [ImageSchema],
  customs: {
    type: [CustomSchema],
    required() {
      return !this.handmade_id
    },
    validate(val) {
      return !this.handmade_id
    }
  },
  handmade_id: {
    type: Schema.Types.ObjectId,
    unique: true,
    ref: 'HMMaterial'
  },
  created_at: Date,
  updated_at: Date
})

ProductSchema.pre('save', (next) => {
  next()
})

const Product = mongoose.model('Product', ProductSchema)

module.exports = Product
