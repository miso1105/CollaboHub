const ProjectInviteResponseDTO = require('../dtos/projectInvite/ProjectInviteResponseDTO');
const RespondInviteResponseDTO = require('../dtos/projectInvite/RespondInviteResponseDTO');
const CustomError = require('../lib/errors/CustomError');
const { ERROR_CODES } = require('../lib/errors/error-codes');
const { withTransaction } = require('../lib/utils/service/withTransaction');
const { checkInvitePreconditions } = require('../lib/utils/validation/checkInvitePreconditions');
const { validateInvite } = require('../lib/utils/validation/validateInvite');
const { validateUser } = require('../lib/utils/validation/validateUser');
const { createNotification } = require('../repositories/notificationRepository');
const { createInvite, getMyInvites: getMyInvitesRepo, getSentInvites: getSentInvitesRepo, getInvitesByUserId: getInvitesByUserIdRepo, deleteInvite: deleteInviteRepo, updateInviteStatus } = require('../repositories/projectInviteRepository'); 
const { createCollaborators } = require('../repositories/collaboratorRepository');
const { checkCollaboratorExists } = require('../lib/utils/validation/checkCollaboratorExists');

// [POST] 댓글 작성자에게 초대 전송 (리더 전용) 
exports.sendInvite = async(dto, userId) => {
    return withTransaction(async (connection) => {
        const { recruitId, commenterId } = dto;
        const { recruit, project } = await checkInvitePreconditions(connection, { recruitId, commenterId, userId });

        // 초대 하려는 멤버가 이미 참여 중인지 확인 
        await checkCollaboratorExists(connection, commenterId, project.id);

        // 초대 생성
        const invite = await createInvite(connection, userId, recruitId, commenterId, recruit.project_id);

        // 초대 생성 이후 알림 생성
        const message = `${project?.project_name || '댓글을 작성한 모집 공고의' } 프로젝트에서 초대를 받았습니다.`;
        await createNotification(connection, {
            senderId: userId,
            notificationContent: message,
            type: 'invite',
            targetId: invite.id,
        });

        const responseDto = new ProjectInviteResponseDTO(invite);
        return responseDto;
    });
};

// [GET] 내가 받은 초대 목록 조회 
exports.getMyInvites = async (userId) => {
    return withTransaction(async (connection) => {
        await validateUser(connection, userId);
        const invites = await getInvitesByUserIdRepo(connection, userId);
        return invites;
    });
};

// [GET] 내가 보낸 초대 목록 조회 (리더 전용) 
exports.getSentInvites = async (userId) => {
    return withTransaction(async (connection) => {
        await validateUser(connection, userId);
        const invites = await getSentInvitesRepo(connection, userId);
        return invites;
    });
};

// [GET] 특정 유저의 초대 내역 전체 조회 (관리자 전용)  
exports.getInvitesByUserId = async (userId) => {
    return withTransaction(async (connection) => {
        await validateUser(connection, userId);
        const invites = await getInvitesByUserIdRepo(connection, userId);
        return invites;
    });
};

// [PATCH] 초대 수락 / 거절 처리 
exports.respondToInvite = async (inviteId, userId, dto) => {
    return withTransaction (async (connection) => {
        const { response } = dto;
        console.log('[respondToInvite] response 값:', response);
        console.log('[typeof]', typeof response);

        const invite = await validateInvite(connection, inviteId);

        // 응답하는 유저가 이미 참여 중인 프로젝트인지 확인 
        await checkCollaboratorExists(connection, userId, invite.project_id);

        // 초대를 받은 본인인지 확인 
        if (invite.receiver_id !== userId) {
            throw new CustomError(ERROR_CODES.FORBIDDEN, '이 초대에 권한이 없는 유저입니다.');
        }

        // 대기 중인 초대가 아닌지 확인
        if (invite.status !== 'pending') {
            throw new CustomError(ERROR_CODES.BAD_REQUEST, '이미 응답한 초대입니다.');
        }

        // 초대 수락 후 collaborators(협업 명단)에 멤버로 추가 
        if (response === 'accepted') {
            await createCollaborators(connection, {
                userId,
                projectId: invite.project_id,
                role: 'member',
            });

            await updateInviteStatus(connection, inviteId, 'accepted');

            return new RespondInviteResponseDTO({
                message: '초대를 수락했습니다.',
                status: 'accepted',
            });
        }
        
        // 초대 거절 
        if (response === 'rejected') { 
            await updateInviteStatus(connection, inviteId, 'rejected');

            return new RespondInviteResponseDTO({
                message: "초대를 거절했습니다.",
                status: 'rejected',
            });
        };

        // 이외의 다른 response 값을 입력했다면 에러처리
        throw new CustomError(ERROR_CODES.BAD_REQUEST, '초대에 응답하는 response 값은 accepted 또는 rejected로 입력해주세요.');
    });
};

// [DELETE] 보낸 초대 삭제 (리더 전용) 
exports.deleteInvite = async (inviteId, userId) => {
    return withTransaction(async (connection) => {
        await validateUser(connection, userId);
        await validateInvite(connection, inviteId);
        await deleteInviteRepo(connection, inviteId, userId);
    });
};