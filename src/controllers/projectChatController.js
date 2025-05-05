const { enterProjectChat: enterProjectChatService, sendProjectChat: sendProjectChatService, deleteMyChat: deleteMyChatService, getChatHistory: getChatHistoryService, getInvitedProjects: getInvitedProjectsService } = require('../services/projectChatService');
const ProjectChatRequestDTO = require('../dtos/projectChat/projectChatRequestDTO');
const { asyncHandler } = require('../lib/utils/express/asyncHandler');
const ProjectChatResponseDTO = require('../dtos/projectChat/ProjectChatResponseDTO');

// collaborator로 등록되면서 해당 프로젝트 id의 그룹채팅방 입장 (서비스 레이어 처리)
exports.enterProjectChat = asyncHandler(async (req, res, next) => {
    const projectId = req.params.projectId;
    const userId  = req.user.id;
    
    await enterProjectChatService(projectId, userId);
    res.status(200).json({ message: `${userId}님이 ${projectId} 채팅방에 참가했습니다.` });
});

// 프로젝트 그룹 채팅 생성 컨트롤러
exports.sendProjectChat = asyncHandler(async (req, res, next) => {
    const requestDto = new ProjectChatRequestDTO(req.body);
    const projectId = req.params.projectId;
    const userId  = req.user.id;

    const savedProjectChat = await sendProjectChatService(requestDto, projectId, userId);
    const responseDto = new ProjectChatResponseDTO(savedProjectChat);

    res.status(200).json({
        projectId,
        senderId: userId,
        projectChat: responseDto.toJson()
    })
});


// 프로젝트 그룹 채팅 내 본인이 작성한 채팅 삭제 컨트롤러
exports.deleteMyChat = asyncHandler(async (req, res, next) => {
    const projectId = req.params.projectId;
    const chatId = req.params.chatId;
    const userId  = req.user.id;

    await deleteMyChatService(projectId, chatId, userId);
    res.status(200).json({
        deletedProjectChatId: chatId
    })
});

// 프로젝트 그룹 채팅 조회 컨트롤러 
exports.getChatHistory = asyncHandler(async (req, res, next) => {
    const projectId = req.params.projectId;
    const limit = parseInt(req.query.limit, 10) || 100;
    const safeLimit = !isNaN(limit) ? Math.min(limit, 200) : 100; 
    let beforeId = parseInt(req.query.beforeId, 10);
    if (isNaN(beforeId)) beforeId = null;

    const projectChats = await getChatHistoryService(projectId, safeLimit, beforeId);
    res.status(200).json(ProjectChatResponseDTO.fromList(projectChats).map(p => p.toJson()));
});

// 채팅 화면 렌더링 
exports.renderChat = (req, res, next) => {
    try {
        res.render('chat', { projectId: req.params.projectId });
    } catch (error) {
        next(error);
    };
};

