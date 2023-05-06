const mongoose = require('mongoose');

const merchantSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  plateNumber: {
    type: String,
    required: true,
    unique: true
  },
  qrCodePath: {
    type: String,
    required: false,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

const Matatu = mongoose.model('Matatu', merchantSchema);

module.exports = Matatu;