
const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;
    // log console for dev
    console.log(err.stack.red);
    // Mongoose bad object id
    if(err.name === 'CastError'){
        const message = `Resource not found`;
        error = new ErrorResponse(message, 404);
    }
    
    // Mongoose duplicare Key
    if(err.code == 11000){
        const message = `Duplicate field value entered`;
        error = new ErrorResponse(message, 400);
    }
    // mongoose validation error
    if(err.name === 'ValidationError'){
        const message = Object.values(err.errors).map(val => val.message);
        error = new ErrorResponse(message, 404);
    }
    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error'
    });
}
module.exports = errorHandler;