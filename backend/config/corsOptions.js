const allowedOrigins = [
    "http://localhost:3000/",
]


const corsOptions = {
    origin: (origin, cb) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            cb(null, true)
        } else {
            cb(new Error('Not allowed by CORS'))
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
}

export {
    corsOptions
}