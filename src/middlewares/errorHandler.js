const { ERROR_CODES } = require('../../lib/errors');
const { NOT_FOUND } = ERROR_CODES;

module.exports.errorHandler = (err, req, res, next) => {
    const status = err.statusCode || ERROR_CODES.INTERNAL_SERVER_ERROR.status;
    const message = err.message || ERROR_CODES.INTERNAL_SERVER_ERROR.message;
    const code = err.code || ERROR_CODES.INTERNAL_SERVER_ERROR.code;

    return res.status(status).json({
        message,
        code,
    });
};

module.exports.routerNotFound = (req, res, next) => {
    const ERROR_CODES = require('./lib/errors/error-codes');
    console.log(`${req.method} ${req.url} 라우터가 없습니다.`);

    res.status(NOT_FOUND.status).json({
        message: NOT_FOUND.message,
        code: NOT_FOUND.code,
    });
};