const mongoose = require('mongoose')
const Schema = mongoose.Schema

const WishSchema = new Schema({
  product_id: {
    type: Schema.Types.ObjectId,
    rel: 'Product',
    required: true
  },
  added_at: Date
})

WishSchema.pre('save', (next) => {
  if (!this.added_at)
    this.added_at = new Date()

  next()
})

module.exports = WishSchema