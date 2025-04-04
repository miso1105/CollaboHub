const { ERROR_CODES } = require('../lib/errors');

exports.errorHandler = (err, req, res, next) => {
    const status = err.status || ERROR_CODES.INTERNAL_SERVER_ERROR.status;
    const message = err.message || ERROR_CODES.INTERNAL_SERVER_ERROR.message;
    const code = err.code || ERROR_CODES.INTERNAL_SERVER_ERROR.code;

    if (typeof err.toJson === 'function') {
        return res.status(status).json(err.toJson());
    }

    return res.status(status).json({
        message,
        code,
    });
};

exports.routerNotFound = (req, res, next) => {
    console.log(`${req.method} ${req.url} 라우터가 없습니다.`);

    res.status(ERROR_CODES.NOT_FOUND.status).json({
        message: ERROR_CODES.NOT_FOUND.message,
        code: ERROR_CODES.NOT_FOUND.code,
    });
};