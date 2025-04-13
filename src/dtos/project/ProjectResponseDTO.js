class ProjectResponseDTO {
    constructor(project) {
        this.id = project.id;
        this.projectName = project.project_name;
        this.content = project.content;
        this.deadline = project.deadline;
    }
    toJson() {
        return {
            id: this.id,
            projectName: this.projectName,
            content: this.content,
            deadline: this.deadline
        }
    }
    static fromList(projects) {
        return projects.map(p => new ProjectResponseDTO(p));
    }
}
module.exports = ProjectResponseDTO;