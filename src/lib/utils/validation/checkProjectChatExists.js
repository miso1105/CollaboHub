const CustomError = require("../../errors/CustomError");
const { ERROR_CODES } = require("../../errors/error-codes");
const { validateProjectChat } = require("./validateProjectChat");
const { validateUser } = require("./validateUser");
const { findProjectChatByChatIdAndUserId } = require('../../../repositories/projectChatRepository');

exports.checkProjectChatExists = async (connection, chatId, userId) => {
    await validateProjectChat(connection, chatId);
    await validateUser(connection, userId);
    const projectChat = await findProjectChatByChatIdAndUserId(connection, chatId, userId);
    if (!projectChat) {
        throw new CustomError(ERROR_CODES.FORBIDDEN, '해당 채팅의 작성자가 아닙니다.');
    }
};