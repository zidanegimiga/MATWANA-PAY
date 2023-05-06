const Passenger = require('../../models/passenger');
const bcrypt = require('bcrypt')
const asyncHandler = require('express-async-handler')

// @desc PassengerAccountCreation
// @route POST /
// @access Public

const createPassenger = asyncHandler(async (req, res) => {
    const { pin, email, username, phoneNumber } = req.body;

    if (!email || !pin || !username || !phoneNumber) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const foundPassenger = await Passenger.findOne({ email }).exec()

    if (foundPassenger) {
        return res.status(409).json({
            type: 'existingEmailAddress',
            title: 'One Little Problem',
            description: 'This email address seems to exist. Sign In instead?',
            success: false,
        })
    }

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashedPin = await bcrypt.hash(pin, salt)

    const userObject = { username, "pin": hashedPin, email, phoneNumber }

    const passenger = await Passenger.create(userObject)

    if(passenger){
        res.status(200).json({
            "success": `${passenger.username} created successfully`
        })
    }
})

module.exports = {createPassenger}