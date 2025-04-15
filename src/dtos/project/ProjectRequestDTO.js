const { validateDate } = require("../../lib/utils/validation/validateRequest");

class ProjectRequestDTO {
    constructor({ projectName, content, deadline, recruitId }) {
        this.projectName = projectName;
        this.content = content;
        this.deadline = deadline;
        this.recruitId = recruitId;

        validateDate(deadline);
    }
}
module.exports = ProjectRequestDTO;