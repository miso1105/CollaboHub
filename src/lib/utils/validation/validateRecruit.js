const { findRecruitById } = require("../../../repositories/recruitRepository");
const CustomError = require("../../errors/CustomError");
const { ERROR_CODES } = require("../../errors/error-codes");

exports.validateRecruit = async (connection, recruitId) => {
    const recruit = await findRecruitById(connection, recruitId);
    if (!recruit) {
        throw new CustomError(ERROR_CODES.NOT_FOUND, '해당 모집 공고를 찾을 수 없습니다.');
    }
}