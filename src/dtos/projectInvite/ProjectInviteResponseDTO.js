class ProjectInviteResponseDTO {
    constructor(invite) {
        this.id = invite.id;
        this.senderId = invite.sender_id;
        this.receiverId = invite.receiver_id;
        this.recruitId = invite.recruit_id;
        this.status = invite.status;
    }
    toJson() {
        return {
            id: this.id,
            senderId: this.senderId,
            receiverId: this.receiverId,
            recruitId: this.recruitId,
            status: this.status,
        };
    }

    static fromList(invites) {
        return invites.map(i => new ProjectInviteResponseDTO(i));
    };
}
module.exports = ProjectInviteResponseDTO;