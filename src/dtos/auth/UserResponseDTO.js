class UserResponseDTO {
    constructor(user) {
        this.id = user.id;
        this.username = user.username;
        this.email = user.email;
    }
    toJson() {
        return {
            id: this.id,
            username: this.username,
            email: this.email, 
        };
    }
}
module.exports = UserResponseDTO;