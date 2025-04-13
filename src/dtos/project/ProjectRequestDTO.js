const { validateDate } = require("../../lib/utils/validation/validateRequest");

class ProjectRequestDTO {
    constructor({ projectName, content, deadline }) {
        this.projectName = projectName;
        this.content = content;
        this.deadline = deadline;

        validateDate(deadline);
    }
}
module.exports = ProjectRequestDTO;