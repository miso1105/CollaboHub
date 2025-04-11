const CustomError = require("../../lib/errors/CustomError");
const { ERROR_CODES } = require("../../lib/errors/error-codes");

class CreateCommentRequestDTO {
    constructor({content, parentId = null}) {
        this.content = content;
        this.parentId = this.parseParentId(parentId);
    }

    parseParentId(pi) {
        if (pi === undefined || pi === null || pi === '') {
            return null;
        }
        if (isNaN(pi)) {
            throw new CustomError(ERROR_CODES.BAD_REQUEST, '부모 댓글이 숫자가 아닙니다.');
        }
        return Number(pi);
    }
}
module.exports = CreateCommentRequestDTO;