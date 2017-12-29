const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const CustomSchema = new Schema({
  custom_id: {
    type: Schema.Types.ObjectId,
    required: true,
    unique: true
  },
  value: {
    type: String,
    required: true
  }
})


const ImageSchema = new Schema ({
  url: {
    type: String,
    required: true
  },
  x: {
    type: String,
    required: true
  },
  y: {
    type: String,
    required: true
  }
})

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
  description: String,
  images: [ImageSchema],
  customs: [CustomSchema],
  handmade_id: {
    type: Schema.Types.ObjectId,
    unique: false,
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
