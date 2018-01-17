const mongoose = require('mongoose')
const Schema = mongoose.Schema

const validate = require('../utils/validators')

const PictureSchema = new Schema({
  url: {
    type: String,
    required: true,
    validate: validate.isPicture
  },
  created_at: Date,
  updated_at: Date
}) 

PictureSchema.pre('save', (next) => {
  next()
})

const Picture = mongoose.model('Picture', PictureSchema)

module.exports = Picture
