const RecruitResponseDTO = require('../dtos/recruit/RecruitResponseDTO');
const { createRecruit: createRecruitRepo, findRecruitById, getAllRecruits, getMyRecruits: getMyRecruitsRepo, updateRecruit: updateRecruitRepo, deleteRecruit: deleteRecruitRepo } = require('../repositories/recruitRepository');
const CustomError = require('../lib/errors/CustomError');
const { ERROR_CODES } = require('../lib/errors/error-codes');
const { validateUser } = require('../lib/utils/validation/validateUser');
const { withTransaction } = require('../lib/utils/service/withTransaction');

exports.createRecruit = async (dto, userId) => {
    return withTransaction(async (connection) => {
        const { projectName, content, deadline, recruitmentField } = dto;
        if (!projectName || !content || !deadline || !recruitmentField) {
            throw new CustomError(ERROR_CODES.BAD_REQUEST, '프로젝트 공고의 제목, 내용, 마감일, 모집 분야를 모두 작성해주세요.');
        }
        await validateUser(connection, userId);
        const recruit = await createRecruitRepo(connection, userId, projectName, content, deadline, recruitmentField);
        const responseDto = new RecruitResponseDTO(recruit);
        
        return responseDto; 
    });
};

exports.getRecruitById = async (recruitId) => {
    return withTransaction(async (connection) => {
        const recruit = await findRecruitById(connection, recruitId);
        if (!recruit) {
            throw new CustomError(ERROR_CODES.NOT_FOUND, '프로젝트 공고를 찾을 수 없습니다.')
        }
        const responseDto = new RecruitResponseDTO(recruit);
        return responseDto;
    });
};

exports.getRecruits = async () => {
    return withTransaction(async (connection) => {
        const recruits = await getAllRecruits(connection);  
        return recruits;
    });
};

exports.getMyRecruits = async (userId) => {
    return withTransaction(async (connection) => {
        await validateUser(connection, userId);
        const recruits = await getMyRecruitsRepo(connection, userId);
        return recruits;
    });
};

exports.updateRecruit = async (dto, userId, recruitId) => {
    return withTransaction(async (connection) => {
        const { projectName, content, deadline, recruitmentField } = dto; 
        if (!projectName || !content || !deadline || !recruitmentField) {
            throw new CustomError(ERROR_CODES.BAD_REQUEST, '프로젝트 공고의 제목, 내용, 마감일, 모집 분야를 모두 작성해주세요.');
        }
        await validateUser(connection, userId);
        const recruit = await findRecruitById(connection, recruitId);
        if (!recruit) {
            throw new CustomError(ERROR_CODES.NOT_FOUND, '프로젝트 공고를 찾을 수 없습니다.')
        }
        const updatedRecruit = await updateRecruitRepo(connection, projectName, content, deadline, recruitmentField, userId, recruitId);
        const responseDto = new RecruitResponseDTO(updatedRecruit);
        return responseDto;
    });
};

exports.deleteRecruit = async (userId, recruitId) => {
    return withTransaction(async (connection) => {
        await validateUser(connection, userId);
        const recruit = await findRecruitById(connection, recruitId);
        if (!recruit) {
            throw new CustomError(ERROR_CODES.NOT_FOUND, '프로젝트 공고를 찾을 수 없습니다.');
        }
        if (recruit.writer != userId) {
            throw new CustomError(ERROR_CODES.BAD_REQUEST, '작성하신 프로젝트 공고가 아닙니다.');
        }
        await deleteRecruitRepo(connection, userId, recruitId);
    });
};
