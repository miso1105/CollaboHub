const { findCommentById } = require("../../../repositories/commentRepository");
const CustomError = require("../../errors/CustomError");
const { ERROR_CODES } = require("../../errors/error-codes");

exports.validateComment = async (connection, commentId) => {
    const comment = await findCommentById(connection, commentId);
    if (!comment) {
        throw new CustomError(ERROR_CODES.NOT_FOUND, '해당 댓글을 찾을 수 없습니다.');
    }
};