class ProjectChatResponseDTO {
    constructor(projectChat) {
        this.id = projectChat.id;
        this.projectId = projectChat.project_id;
        this.senderId = projectChat.sender_id;
        this.message = projectChat.message;
        this.createdAt = projectChat.created_at;
    }
    toJson () {
        return {
            id: this.id,
            projectId: this.projectId,
            senderId: this.senderId,
            message: this.message,
            createdAt: this.createdAt
        }
    }

    static fromList(projectChats) {
        return projectChats.map(p => new ProjectChatResponseDTO(p));
    }
}
module.exports = ProjectChatResponseDTO;