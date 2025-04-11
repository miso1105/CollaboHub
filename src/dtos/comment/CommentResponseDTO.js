class CommentResponseDTO {
    constructor(comment) {
        this.id = comment.id;
        this.content = comment.content;
        this.commenterId = comment.commenter_id;
        this.parentCommentId = comment.parent_comment_id;
        this.recruitId = comment.recruitment_id;
    }
    toJson() {
        return {
            id: this.id,
            content: this.content,
            commenterId: this.commenterId,
            parentCommentId: this.parentCommentId,
            recruitId: this.recruitId, 
        }
    }
    static fromList(comments) {
        return comments.map(c => new CommentResponseDTO(c));
    }
}
module.exports = CommentResponseDTO;