class RespondInviteResponseDTO {
    constructor({ message, status }) {
        this.message = message;
        this.status = status;
    }
    toJson() {
        return {
            message: this.message,
            status: this.status
        }
    }
}
module.exports = RespondInviteResponseDTO;