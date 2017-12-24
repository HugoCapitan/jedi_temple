const mongoose = require('mongoose')
const Schema = mongoose.Schema;

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
    ref: 'HMProduct'
  },
  materialID: {
    type: Schema.Types.ObjectId,
    required: true,
    unique: true,
    ref: 'HMMaterial'
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
  images: [ImageSchema],
  customs: mongoose.SchemaTypes.Mixed,
  handmade: HandmadeSchema,
  created_at: Date,
  updated_at: Date
})

Product.prependListener('save', () => {

})

const Product = mongoose.model('Product', ProductSchema)

module.exports = Product
