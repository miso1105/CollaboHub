const { CustomError, ERROR_CODES } = require('../errors');

exports.wrapService = (fn) => {
    return async (...args) => {
        try {
            return await fn(...args);
        } catch (error) {
            console.error('service code error:', error.message);
            if (error instanceof CustomError) throw error;
            throw new CustomError(ERROR_CODES.INTERNAL_SERVER_ERROR, error.message, error);
        }
    }; 
};