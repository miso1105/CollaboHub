class GetProjectInviteResponseDTO {
    constructor(row) {
        this.inviteId = row.invite_id;
        this.recruitId = row.recruit_id;
        this.recruitTitle = row.recruit_title;
        this.status = row.status;
        this.sentAt = row.sent_at;

        this.sender = {
            id: row.sender_id,
            email: row.sender_email,
        };

        this.receiver = {
            id: row.receiver_id,
            email: row.receiver_email,
        };
    }
    toJson() {
        return {
            id: this.inviteId,
            senderId: this.senderId,
            receiverId: this.receiverId,
            recruitId: this.recruitId,
            recruitTitle: this.recruitTitle,
            status: this.status,
            sentAt: this.sentAt,
            sender: this.sender,
            receiver: this.receiver,
        };
    }

    static fromList(rows) {
        return rows.map(r => new GetProjectInviteResponseDTO(r));
    };
}
module.exports = GetProjectInviteResponseDTO;