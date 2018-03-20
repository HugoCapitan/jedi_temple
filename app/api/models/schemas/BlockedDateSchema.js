const mongoose = require('mongoose')
const Schema = mongoose.Schema

const BlockedDateSchema = new Schema({
  start_date: {
    type: Date,
    required: true
  },
  end_date: {
    type: Date,
    required: true
  },
  motive: {
    type: String,
    required: true,
    enum: ['blocked_by_admin', 'already_reserved'],
  },
  reservation_id: {
    type: Schema.Types.ObjectId,
    ref: 'Reservation',
    required() { return this.type === 'already_reserved' }
  }
})

module.exports = BlockedDateSchema

