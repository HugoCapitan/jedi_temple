const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Store = require('./Store')

const TextSchema = new Schema({
  text: {
    type: String,
    required: true
  },
  created_at: Date,
  updated_at: Date
})

TextSchema._middlewareFuncs = {
  preSave(next) {
    const self = this

    const currentDate = new Date()
    self.updated_at = currentDate
    if (!self.created_at) self.created_at = currentDate

    return next()
  },
  preUpdate(next) {
    const self = this

    self._update.updated_at = new Date()

    return next()
  },
  preRemove(next) {
    const self = this

    Store.find({texts: self._conditions._id}).exec()
    .then(storesToModify => {
      const saves = []
      for (const store of storesToModify) {
        store.texts.pull(self._conditions._id)
        saves.push(store.save())
      }
      return Promise.all(saves)
    })
    .then(() => next())
    .catch(err => next(err))
  }
}

TextSchema.pre('save', TextSchema._middlewareFuncs.preSave)
TextSchema.pre('udpate', TextSchema._middlewareFuncs.preUpdate)
TextSchema.pre('findOneAndUpdate', TextSchema._middlewareFuncs.preUpdate)
TextSchema.pre('remove', TextSchema._middlewareFuncs.preRemove)
TextSchema.pre('findOneAndRemove', TextSchema._middlewareFuncs.preRemove)

const Text = mongoose.model('Text', TextSchema)

module.exports = Text
