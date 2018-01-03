const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const HMMaterial = require('./HMMaterial')

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
    required: true,
    validate(val) { return hasValidFormat(val) }
  },
  x: {
    type: String,
    required: true,
    validate(val) { return hasValidUnits(val) }
  },
  y: {
    type: String,
    required: true,
    validate(val) { return hasValidUnits(val) }
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

function hasValidUnits(val) {
  const units = [val.substr(val.length - 1), val.substr(val.length - 2)]
  const isValid = units.find((unit) => {
    return unit === '%' || unit === 'px' || unit === 'pt'
  })
  return !!isValid
}

function hasValidFormat(val) {
  const valFormat = val.split('.').pop()
  const validFormats = ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG']
  const isValid = validFormats.find((format) => {
    return format === valFormat
  })
  return !!isValid
}
