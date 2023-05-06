const mongoose = require('mongoose');

const passengerSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  pin: {
    type: String,
    required: true
  },
  verified: {
    type: Boolean,
    default: false
  }
});

const Passenger = mongoose.model('Passenger', passengerSchema);

module.exports = Passenger;