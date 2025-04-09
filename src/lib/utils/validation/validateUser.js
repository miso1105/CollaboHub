const { findUserById } = require("../../../repositories/authReository");
const { CustomError, ERROR_CODES } = require('../../errors');

exports.validateUser = async (connection, userId) => {
    const user = await findUserById(connection, userId);
    if (!user) {
        throw new CustomError(ERROR_CODES.NOT_FOUND, '유저를 찾을 수 없습니다.');
    }
};