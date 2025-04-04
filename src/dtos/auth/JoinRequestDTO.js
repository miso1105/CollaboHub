class JoinRequestDTO{
    constructor({ userName, email, developmentField, password }) {
        this.userName = userName;
        this.email = email;
        this.developmentField = developmentField;
        this.password = password;
    }
}
module.exports = JoinRequestDTO;