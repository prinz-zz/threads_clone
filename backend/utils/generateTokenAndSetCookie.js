import jwt from 'jsonwebtoken'

const generateTokenAndSetCookie = (userId, res) => {
    //generate token
    const token = jwt.sign(
        { userId },
        process.env.JWT_SECRET, {
        expiresIn: '30d'
    })

    //set Cookie
    res.cookie(
        'jwt', token,
        {
            httpOnly: true, // not access by JS
            maxAge: 30 * 24 * 60 * 60 * 1000, //30days
            sameSite: 'strict'
        }
    )

}

export {
    generateTokenAndSetCookie,
}