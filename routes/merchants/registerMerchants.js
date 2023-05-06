const express = require('express');
const router = express.Router();
const registerMerchant = require('../../controllers/merchants/registerMerchantController')

router.route('/').post(registerMerchant.createMerchant);

module.exports = router