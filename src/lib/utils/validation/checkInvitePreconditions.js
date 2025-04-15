const { validateProject } = require('./validateProject');
const { validateRecruit } = require('./validateRecruit');
const { validateUser } = require('./validateUser');
const { hasUserCommentedOnRecruit } = require('../../../repositories/commentRepository');
const CustomError = require('../../errors/CustomError');
const { ERROR_CODES } = require('../../errors/error-codes');

exports.checkInvitePreconditions = async (connection, { recruitId, commenterId, userId }) => {
    if (!recruitId || !commenterId) {
        throw new CustomError(ERROR_CODES.BAD_REQUEST, '게시한 모집 공고의 id와 초대할 댓글 작성자의 id를 입력해주세요.');
    }
    await validateUser(connection, userId);
    await validateUser(connection, commenterId);
    
    const recruit = await validateRecruit(connection, recruitId);
    if (!recruit.project_id) {
        throw new CustomError(ERROR_CODES.BAD_REQUEST, '해당 모집 공고에 연결된 프로젝트가 없습니다. 먼저 협업 공간을 생성한 후 초대해주세요.');
    }

    const project = await validateProject(connection, recruit.project_id); 
    if (project.leader_id !== userId) {
        throw new CustomError(ERROR_CODES.FORBIDDEN, '해당 프로젝트의 리더만 초대를 보낼 수 있습니다.');
    }

    // 모집 공고에 댓글 작성자 id가 있는지 검증 
    const hasCommented = await hasUserCommentedOnRecruit(connection, recruitId, commenterId);
    if (!hasCommented) {
        throw new CustomError(ERROR_CODES.NOT_FOUND, '모집 공고에 유저가 댓글을 작성하지 않았습니다.'); 
    }

    return { recruit, project };
};