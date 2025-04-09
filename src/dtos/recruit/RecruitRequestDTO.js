const { validateDate } = require("../../lib/utils/validation/validateRequest");

class RecruitRequestDTO {
    constructor({ projectName, content, deadline, recruitmentField }) {
        this.projectName = projectName;
        this.content = content;
        this.deadline = deadline;
        this.recruitmentField = recruitmentField;

        validateDate(deadline);
    }
}
module.exports = RecruitRequestDTO;