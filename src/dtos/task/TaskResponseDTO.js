const CustomError = require("../../lib/errors/CustomError");
const { ERROR_CODES } = require("../../lib/errors/error-codes");

class TaskResponseDTO {
    constructor(task) {
        this.id = task.id;
        this.title = task.title;
        this.deadline = task.deadline;
        this.priority = task.priority;
        this.status = task.status;
        this.description = task.description;
        this.projectId = task.project_id;
        this.assignerId = task.assigner_id;
    }
    toJson() {
        return {
            id: this.id,
            title: this.title,
            deadline: this.deadline,
            priority: this.priority,
            status: this.status,
            description: this.description,
            projectId: this.projectId,
            assignerId: this.assignerId,
        }
    }
    
    static fromList(tasks) {
        return tasks.map(t => new TaskResponseDTO(t))
    }
}
module.exports = TaskResponseDTO;