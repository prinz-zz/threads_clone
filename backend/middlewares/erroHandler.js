
const errorHandler = async (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500 //Internal Error

    res.status(statusCode)

    res.json({
        message: err.message,
        stackTrace: err.stack
    })
}
export {
    errorHandler
}