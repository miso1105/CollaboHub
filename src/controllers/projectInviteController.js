
const GetProjectInviteResponseDTO = require('../dtos/projectInvite/GetProjectInviteResponseDTO');
const ProjectInviteRequestDTO = require('../dtos/projectInvite/ProjectInviteRequestDTO');
const RespondInviteRequestDTO = require('../dtos/projectInvite/RespondInviteRequestDTO');
const { asyncHandler } = require('../lib/utils/express/asyncHandler');
const { sendInvite: sendInviteService, getMyInvites: getMyInvitesService, getSentInvites: getSentInvitesService, getInvitesByUserId: getInvitesByUserIdService, respondToInvite: respondToInviteService, deleteInvite: deleteInviteService } = require('../services/projectInviteService');

// 멤버 초대 컨트롤러 (리더 전용) 
exports.sendInvite = asyncHandler(async (req, res, next) => {
    const requestDto = new ProjectInviteRequestDTO(req.body);
    const userId = req.user.id;
    const responseDto = await sendInviteService(requestDto, userId);
    return res.status(201).json({
        invite: responseDto.toJson(),
        meta: {
            message: "댓글 작성자에게 초대가 전송되었습니다.",
        }
    });
});

// 내 초대 조회 컨트롤러 
exports.getMyInvites = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;
    const invites = await getMyInvitesService(userId);
    return res.status(200).json({
        receivedInvites: GetProjectInviteResponseDTO.fromList(invites).map(i => i.toJson())
    });
});

// 보낸 초대 조회 컨트롤러 (리더 전용) 
exports.getSentInvites = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;
    const invites = await getSentInvitesService(userId);
    return res.status(200).json({
        sentInvites: GetProjectInviteResponseDTO.fromList(invites).map(i => i.toJson())
    });
});

// 유저 아이디 기반 초대 전체 조회 컨트롤러
exports.getInvitesByUserId = asyncHandler(async (req, res, next) => {
    const userId = req.params.userId;
    const invites = await getInvitesByUserIdService(userId);
    return res.status(200).json({
        userId: userId,
        invites: GetProjectInviteResponseDTO.fromList(invites).map(i => i.toJson())
    });
});

// 받은 초대 응답 컨트롤러 
exports.respondToInvite = asyncHandler(async (req, res, next) => {
    const inviteId = req.params.inviteId;
    const userId = req.user.id;
    const requestDto = new RespondInviteRequestDTO(req.body);
    const responseDto = await respondToInviteService(inviteId, userId, requestDto);
    return res.status(200).json(responseDto.toJson());
});

// 보낸 초대 삭제 컨트롤러 (리더 전용)  
exports.deleteInvite = asyncHandler(async (req, res, next) => {
    const inviteId = req.params.inviteId;
    const userId = req.user.id;
    await deleteInviteService(inviteId, userId);
    return res.status(200).json({
        deletedInviteId: inviteId
    })
});