
import asynchandler from 'express-async-handler'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const protectedRoute = asynchandler(async (req, res, next) => {

    const token = req.cookies.jwt

    if (!token) {
        res.status(401)
        throw new Error('Unauthorized !')
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await User.findById(decoded.userId).select('-password')

    req.user = user

    next() //to call the next function

})

export {
    protectedRoute,
}