const express = require('express');
const router = express.Router();
const loginPassenger = require('../../controllers/passengers/loginPassengerController')

router.route('/login').post(loginPassenger.login)

router.route('/refresh').get(loginPassenger.refresh);

router.route('/logout').post(loginPassenger.logout);

module.exports = router