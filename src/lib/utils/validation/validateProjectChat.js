const { findProjectChatById } = require("../../../repositories/projectChatRepository");
const CustomError = require("../../errors/CustomError");
const { ERROR_CODES } = require("../../errors/error-codes");

exports.validateProjectChat = async(connection, chatId) => {
    const projectChat = await findProjectChatById(connection, chatId);
    if (!projectChat) {
        throw new CustomError(ERROR_CODES.NOT_FOUND, '존재하지 않는 프로젝트 채팅입니다.');
    }
};