const CustomError = require('../lib/errors/CustomError');
const { ERROR_CODES } = require('../lib/errors/error-codes');
const { withTransaction } = require('../lib/utils/service/withTransaction');
const { checkProjectChatExists } = require('../lib/utils/validation/checkProjectChatExists');
const { validateCollaborator } = require('../lib/utils/validation/validateCollaborator');
const { validateProject } = require('../lib/utils/validation/validateProject');
const { validateProjectChat } = require('../lib/utils/validation/validateProjectChat');
const { validateUser } = require('../lib/utils/validation/validateUser');
const { createProjectChat, deleteMyChat: deleteMyChatRepo, getChatHistory: getChatHistoryRepo } = require('../repositories/projectChatRepository');
const { redisClient } = require('../config/redis');

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

        // 채팅 첫 페이지 로드 이후 새로운 메시지가 전송되면 페이지 캐시 무효화 
        const cacheKey = `project:${projectId}:recentChats`;
        await redisClient.del(cacheKey);

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

// [GET] 참여 프로젝트 채팅 조회  
exports.getChatHistory = async (projectId, safeLimit, beforeId) => {
    // 레디스 캐시 키
    const cacheKey = `project:${projectId}:recentChats`;

    // beforeId 가 없으면(과거 채팅 조회 요청이 없을 때) 최신 첫 페이지 요청 시 캐시 조회
    if (!beforeId) {
        const cachedChats = await redisClient.v4.get(cacheKey);
        // 캐시가 있으면 DB 조회 없이 바로 반환
        if (cachedChats) {
            console.log('캐시에서 채팅 데이터 조회');
            return JSON.parse(cachedChats);
        } else {
            console.log('캐시 미스');
        }
    }
    
    // 캐시 미스 or beforeId가 있을 때만 검증 + DB 조회
    return withTransaction(async (connection) => {
        // 검증 
        await validateProject(connection, projectId);

        // DB 조회
        console.log('DB에서 채팅 데이터 조회');

        // DB에서 커서 기반 페이징 쿼리로 조회
        const projectChats = await getChatHistoryRepo(connection, projectId, safeLimit, beforeId);
        
        // 채팅 조회 첫 페이지 요청일 때만 조회 결과를 캐시에 저장 
        if (!beforeId) {
            await redisClient.v4.set(
                cacheKey,
                JSON.stringify(projectChats), 
                { EX: 60 }
            );
        }

        return projectChats;
    });
};