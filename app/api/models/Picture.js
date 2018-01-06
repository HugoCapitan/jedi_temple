const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PictureSchema = new Schema({
  url: {
    type: String,
    required: true
  },
  created_at: Date,
  updated_at: Date
}) 

PictureSchema.pre('save', (next) => {
  next()
})

const Picture = mongoose.model('Picture', PictureSchema)

module.exports = Picture
