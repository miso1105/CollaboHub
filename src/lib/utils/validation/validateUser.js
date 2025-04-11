const { findUserById } = require("../../../repositories/authReository");
const CustomError = require("../../errors/CustomError");
const { ERROR_CODES } = require("../../errors/error-codes");

exports.validateUser = async (connection, userId) => {
    const user = await findUserById(connection, userId);
    if (!user) {
        throw new CustomError(ERROR_CODES.NOT_FOUND, '유저를 찾을 수 없습니다.');
    }
};