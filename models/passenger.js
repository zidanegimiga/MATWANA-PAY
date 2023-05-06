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
  phoneNumber: {
    type: String,
    required: true,
    unique: true
  },
  pin: {
    type: String,
    required: true
  },
});

const Passenger = mongoose.model('Passenger', passengerSchema);

module.exports = Passenger;