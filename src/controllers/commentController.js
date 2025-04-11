const CreateCommentRequestDTO = require('../dtos/comment/CreateCommentRequestDTO');
const UpdateCommentRequestDTO = require('../dtos/comment/UpdateCommentRequestDTO');
const { asyncHandler } = require('../lib/utils/express/asyncHandler');
const { 
    createComment: createCommentService, 
    getComment: getCommentService, 
    getCommentsByRecruitId: getCommentsByRecruitIdService, 
    updateComment: updateCommentService, 
    deleteComment: deleteCommentService 
} = require('../services/commentService');

// 댓글 생성 컨트롤러
exports.createComment = asyncHandler(async (req, res, next) => {
    const requestDto = new CreateCommentRequestDTO(req.body);
    const userId = req.user.id;
    const recruitId = req.params.id;
    const responseDto = await createCommentService(requestDto, userId, recruitId);
    return res.status(201).json(responseDto.toJson());
});

// 댓글 단건 조회 컨트롤러
exports.getComment = asyncHandler(async (req, res, next) => {
    const commentId = req.params.id;
    const responseDto = await getCommentService(commentId);
    return res.status(200).json(responseDto.toJson());
});

// 모집 공고 내 댓글 전체 조회 컨트롤러
exports.getCommentsByRecruitId = asyncHandler(async (req, res, next) => {
    const recruiId = req.params.id;
    const responseDtos = await getCommentsByRecruitIdService(recruiId);
    return res.status(200).json(responseDtos.map(r => r.toJson()));
});

// 댓글 수정 컨트롤러
exports.updateComment = asyncHandler(async (req, res, next) => {
    const requestDto = new UpdateCommentRequestDTO(req.body.content);
    const userId = req.user.id;
    const commentId = req.params.id;
    const responseDto = await updateCommentService(requestDto, userId, commentId);
    return res.status(200).json(responseDto.toJson());
});

// 댓글 삭제 컨트롤러 
exports.deleteComment = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;
    const commentId = req.params.id;
    await deleteCommentService(userId, commentId);
    return res.status(200).json({ 
        message: '댓글 삭제 성공',
        deletedCommentId: commentId,
    })
});