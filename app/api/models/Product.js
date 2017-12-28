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

const HandmadeSchema = new Schema({
  handmadeID: {
    type: Schema.Types.ObjectId,
    required: true,
    unique: true,
    ref: 'HMProduct'
  },
  materialID: {
    type: Schema.Types.ObjectId,
    required: true,
    unique: true,
    ref: 'HMMaterial'
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
  description: String,
  images: [ImageSchema],
  customs: [CustomSchema],
  handmade: HandmadeSchema,
  created_at: Date,
  updated_at: Date
})

ProductSchema.pre('save', () => {

})

const Product = mongoose.model('Product', ProductSchema)

module.exports = Product
