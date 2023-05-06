const express = require('express');
const router = express.Router();
const registerPassenger = require('../../controllers/passengers/registerPassengerController')

router.route('/').post(registerPassenger.createPassenger);

module.exports = router