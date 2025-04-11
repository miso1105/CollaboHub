const CommentResponseDTO = require('../dtos/comment/CommentResponseDTO');
const CustomError = require('../lib/errors/CustomError');
const { ERROR_CODES } = require('../lib/errors/error-codes');
const { withTransaction } = require('../lib/utils/service/withTransaction');
const { validateRecruit } = require('../lib/utils/validation/validateRecruit');
const { validateUser } = require('../lib/utils/validation/validateUser');
const { 
    createComment: createCommentRepo, 
    getComment: getCommentRepo, 
    getCommentsByRecruitId: getCommentsByRecruitIdRepo, 
    updateComment: updateCommentRepo, 
    deleteComment: deleteCommentRepo 
} = require('../repositories/commentRepository');
const { validateComment } = require('../lib/utils/validation/validateComment');

exports.createComment = async (dto, userId, recruitId) => {
    return withTransaction(async (connection) => {
        const { content, parentId } = dto;
        if (!content) {
            throw new CustomError(ERROR_CODES.BAD_REQUEST, '댓글을 작성해주세요.');
        }
        if (parentId) {
            await validateComment(connection, parentId);
        }
        await validateUser(connection, userId);
        await validateRecruit(connection, recruitId);

        const comment = await createCommentRepo(connection, content, parentId, userId, recruitId);
        const responseDto = new CommentResponseDTO(comment);
        return responseDto;
    });
};

exports.getComment = async(commentId) => {
    return withTransaction(async (connction) => {
        await validateComment(connction, commentId);
        const comment = await getCommentRepo(connction, commentId);
        const responseDto = new CommentResponseDTO(comment);
        return responseDto;
    });
};

exports.getCommentsByRecruitId = async(recruiId) => {
    return withTransaction(async (connection) => {
        await validateRecruit(connection, recruiId);
        const comments = await getCommentsByRecruitIdRepo(connection, recruiId);
        const responseDtos = CommentResponseDTO.fromList(comments);
        return responseDtos;
    });
};

exports.updateComment = async (dto, userId, commentId) => {
    return withTransaction(async (connection) => {
        const { content } = dto;
        if (!content) {
            throw new CustomError(ERROR_CODES.BAD_REQUEST, '댓글을 작성해주세요.');
        }
        await validateUser(connection, userId); 
        await validateComment(connection, commentId);
        const comment = await updateCommentRepo(connection, content, commentId);
        const responseDto = new CommentResponseDTO(comment);
        return responseDto;
    });
};

exports.deleteComment = async(userId, commentId) => {
    return withTransaction(async (connction) => {
        await validateUser(connction, userId);
        await validateComment(connction, commentId);
        await deleteCommentRepo(connction, userId, commentId);
    });
};

