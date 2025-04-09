const { CustomError, ERROR_CODES } = require('../../errors');

exports.handleDbError = (error) => {
    console.error('DB 에러', error.message, '\n', error.stack);
    throw new CustomError(ERROR_CODES.DB_QUERY_ERROR, error.message);
};