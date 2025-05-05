const { findCollaboratorByUserIdAndProjectId } = require("../../../repositories/collaboratorRepository");
const CustomError = require("../../errors/CustomError");
const { ERROR_CODES } = require("../../errors/error-codes");

exports.validateCollaborator = async (connection, userId, projectId) => {
    const collaborator = await findCollaboratorByUserIdAndProjectId(connection, userId, projectId);
    if (!collaborator) {
        throw new CustomError(ERROR_CODES.NOT_FOUND, '프로젝트에 참여 중인 멤버가 아닙니다.');
    };
};