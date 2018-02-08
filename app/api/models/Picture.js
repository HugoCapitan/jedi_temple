const mongoose = require('mongoose')
const Schema = mongoose.Schema

const validate = require('../utils/validators')

const PictureSchema = new Schema({
  url: {
    type: String,
    required: true,
    validate: validate.isPicture
  },
  store: {
    type: String,
    required: true
  },
  created_at: Date,
  updated_at: Date
}) 

PictureSchema._middlewareFuncs = {
  preSave(next) {
    const currentDate = new Date()
    this.updated_at = currentDate
    if(!this.created_at) this.created_at === currentDate
  
    return next()
  },
  preUpdate(next) {
    this._update.updated_at = new Date()
    return next()
  }
}

PictureSchema.pre('save', PictureSchema._middlewareFuncs.preSave)
PictureSchema.pre('update', PictureSchema._middlewareFuncs.preUpdate)
PictureSchema.pre('findOneAndUpdate', PictureSchema._middlewareFuncs.preUpdate)

const Picture = mongoose.model('Picture', PictureSchema)

module.exports = Picture
