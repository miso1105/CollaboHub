const CustomError = require("../../errors/CustomError");
const { ERROR_CODES } = require("../../errors/error-codes");
const { findCollaboratorByUserIdAndProjectId } = require('../../../repositories/collaboratorRepository');

exports.checkCollaboratorExists = async (connection, userId, projectId) => {
    const result = await findCollaboratorByUserIdAndProjectId(connection, userId, projectId);
    if (result.length > 0) {
        throw new CustomError(ERROR_CODES.BAD_REQUEST, '이미 프로젝트에 참여 중인 멤버입니다.');
    }
}; 