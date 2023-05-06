const Passenger = require('../../models/passenger')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

// @desc Login
// @route POST /auth
// @access Public
const login = asyncHandler(async (req, res) => {
    const { email, pin } = req.body

    if (!email || !pin) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const foundPassenger = await Passenger.findOne({ email }).exec()


    // implement internal error types; In numbers
    // e.g 700 -> (&)
    if (!foundPassenger) {
        return res.status(401).json({ title: 'One Little Problem', description: 'The email address you entered is not connected to an account' })
    }

    const match = await bcrypt.compare(pin, foundPassenger.pin)

    if (!match) return res.status(401).json({ title: 'One Little Problem', description: 'The password you have entered is incorrect' })

    const passengerId = foundPassenger._id.toString()

    const accessToken = jwt.sign(
        {
            "UserInfo": {
                "email": foundPassenger.email,
                "userId": passengerId
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1000m' }
    )

    const userDetails = {
        email: foundPassenger.email,
        id: userId,
        username: foundUser.username
    }

    const refreshToken = jwt.sign(
        { "email": foundPassenger.email, "userId": userId },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    )

    // Create secure cookie with refresh token 
    res.cookie('jwt', refreshToken, {
        httpOnly: true, //accessible only by web server 
        secure: true, //https
        sameSite: 'None', //cross-site cookie 
        maxAge: 7 * 24 * 60 * 60 * 1000 //cookie expiry: set to match refreshToken
    })

    // Send accessToken containing username and roles 
    res.status(200).json({ accessToken, userDetails })
})

// @desc Refresh
// @route GET /auth/refresh
// @access Public - because access token has expired
const refresh = (req, res) => {
    const cookies = req.cookies

    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' })

    const refreshToken = cookies.jwt

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        asyncHandler(async (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' })

            const foundPassenger = await Passenger.findOne({ username: decoded.username }).exec()

            if (!foundPassenger) return res.status(401).json({ message: 'Unauthorized' })

            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": foundPassenger.username,
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' }
            )

            res.json({ accessToken })
        })
    )
}

// @desc Logout
// @route POST /auth/logout
// @access Public - just to clear cookie if exists
const logout = (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204) //No content
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
    res.json({ message: 'Cookie cleared' })
}

module.exports = {
    login,
    refresh,
    logout
}