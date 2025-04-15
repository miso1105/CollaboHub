const { findProjectById } = require("../../../repositories/projectRepository");
const CustomError = require("../../errors/CustomError");
const { ERROR_CODES } = require("../../errors/error-codes");

exports.validateProject = async (connection, projectId) => {
    const project = await findProjectById(connection, projectId);
    if (!project) {
        throw new CustomError(ERROR_CODES.NOT_FOUND, '프로젝트를 찾을 수 없습니다.');
    }
    return project;
};