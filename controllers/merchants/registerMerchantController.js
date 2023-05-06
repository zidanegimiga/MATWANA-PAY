const Merchant = require('../../models/matatu');
const bcrypt = require('bcrypt')
const asyncHandler = require('express-async-handler')
const fs = require('fs')
const qrcode = require('qrcode');

// @desc MerchantAccountCreation
// @route POST /
// @access Public

const createMerchant = asyncHandler(async (req, res, next) => {
    const { email, plateNumber, username, phoneNumber, password } = req.body;

    if (!email || !plateNumber || !username || !phoneNumber || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const foundMerchant = await Merchant.findOne({ plateNumber }).exec()

    if (foundMerchant) {
        return res.status(409).json({
            type: 'existingPlateNumber',
            title: 'One Little Problem',
            description: 'This platenumber seems to exist. Sign In instead?',
            success: false,
        })
    }

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashedPassword = await bcrypt.hash(password, salt)

    const merchantObject = { username, "password": hashedPassword, email, phoneNumber, plateNumber }

    const merchant = await Merchant.create(merchantObject)

    if (merchant) {
        const merchantId = merchant._id;
        console.log(merchantId.toString())
        const qrCodeDataUrl = await qrcode.toDataURL(merchantId.toString());
        console.log(typeof qrCodeDataUrl);

        const qrCodeFilename = `${merchant._id.toString()}.png`;
        const qrCodePath = `/qrcodeImages/${qrCodeFilename}`;
        merchant.qrCodePath = qrCodePath;
        await merchant.save();

        const qrCodeBuffer = Buffer.from(qrCodeDataUrl.split(',')[1], 'base64');
        const qrCodeFilepath = __dirname + qrCodePath;
        fs.writeFileSync(qrCodeFilepath, qrCodeBuffer);
        res.status(200).sendFile(qrCodeFilepath);
    }
})

module.exports = { createMerchant }