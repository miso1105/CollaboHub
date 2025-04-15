const { findInviteById } = require("../../../repositories/projectInviteRepository");
const CustomError = require("../../errors/CustomError");
const { ERROR_CODES } = require("../../errors/error-codes");

exports.validateInvite = async (connection, inviteId) => {
    const invite = await findInviteById(connection, inviteId);
    if (!invite) {
        throw new CustomError(ERROR_CODES.NOT_FOUND, '초대를 찾을 수 없습니다.');
    };
    return invite;
}