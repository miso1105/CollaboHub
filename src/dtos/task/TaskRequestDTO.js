const { validateDate } = require("../../lib/utils/validation/validateRequest");

class TaskRequestDTO {
    constructor({ title, deadline, priority, status, description = null }) {
        this.title = title;
        this.deadline = deadline;
        this.priority = priority;
        this.status = status;
        this.description = this.validateDescription(description);

        validateDate(deadline);
    }

    validateDescription(dp) {
        return dp?.trim?.() === '' ? null : dp ?? null;
    }
}
module.exports = TaskRequestDTO;