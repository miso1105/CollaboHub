const CustomError = require('../lib/errors/CustomError');
const { ERROR_CODES } = require('../lib/errors/error-codes');
const { withTransaction } = require('../lib/utils/service/withTransaction');
const { checkProjectChatExists } = require('../lib/utils/validation/checkProjectChatExists');
const { validateCollaborator } = require('../lib/utils/validation/validateCollaborator');
const { validateProject } = require('../lib/utils/validation/validateProject');
const { validateProjectChat } = require('../lib/utils/validation/validateProjectChat');
const { validateUser } = require('../lib/utils/validation/validateUser');

const { createProjectChat, deleteMyChat: deleteMyChatRepo, getChatHistory: getChatHistoryRepo } = require('../repositories/projectChatRepository');

// [GET] 채팅 입장을 위한 검증 
exports.enterProjectChat = async (projectId, userId) => {
    return withTransaction(async (connection) => {
        await validateProject(connection, projectId);
        await validateUser(connection, userId);
        await validateCollaborator(connection, userId, projectId);
    });
};

// [POST] 협업 중인 멤버들에게 채팅 전송 
exports.sendProjectChat = async (requestDto, projectId, userId) => {
    return withTransaction(async (connection) => {
        const { message, imageUrls } = requestDto;

        if (!message && !imageUrls) {
            throw new CustomError(ERROR_CODES.BAD_REQUEST, '메시지를 입력해주세요.');
        };
        await validateProject(connection, projectId);
        await validateUser(connection, userId);

        const savedProjectChat = await createProjectChat(
            connection, message, projectId, userId, imageUrls ? JSON.stringify(imageUrls) : null
        );
        return savedProjectChat;
    });
};

// [DELETE] 채팅 메시지 삭제 (작성자 전용)
exports.deleteMyChat = async (projectId, chatId, userId) => {
    return withTransaction(async (connection) => {
        await validateProject(connection, projectId);
        await validateProjectChat(connection, chatId);
        await validateUser(connection, userId);
        await checkProjectChatExists(connection, chatId, userId);
        await deleteMyChatRepo(connection, chatId, userId);
    });
};

// [GET] 참여 프로젝트 채팅 목록 조회  
exports.getChatHistory = async (projectId, safeLimit, beforeId) => {
    return withTransaction(async (connection) => {
        await validateProject(connection, projectId);
        
        const projectChats = await getChatHistoryRepo(connection, projectId, safeLimit, beforeId);
        return projectChats;
    });
};