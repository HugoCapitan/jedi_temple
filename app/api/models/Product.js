const mongoose = require('mongoose')
const Schema = mongoose.Schema;
// const { String, ObjectId } = ...Schema.Types

const HMProduct = require('./HMProduct') 
const HMMaterial = require('./HMMaterial')

const ImageSchema = new Schema ({
  url: {
    type: String,
    required: true
  },
  position_x: {
    type: String,
    required: true
  },
  position_y: {
    type: String,
    required: true
  }
})

const HandmadeSchema = new Schema({
  handmadeID: {
    type: Schema.Types.ObjectId,
    required: true,
    unique: true,
    ref: HMProduct
  },
  materialID: {
    type: Schema.Types.ObjectId,
    required: true,
    unique: true,
    ref: HMMaterial
  }
})

const ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
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
    required: false
  },
  images: {
    type: [ImageSchema],
    required: false
  },
  handmade: {
    type: HandmadeSchema,
    required: false
  },
  created_at: {
    type: Date,
    required: true
  },
  updated_at: {
    type: Date,
    required: true
  }
})

Product.prependListener('save', () => {

})

const Product = mongoose.model('Product', ProductSchema)

module.exports = Product
