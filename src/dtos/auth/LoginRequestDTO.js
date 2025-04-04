class LoginRequestDTO {
    constructor({ email, password }) {
        this.email = email;
        this.password = password;
        this.validate();
    }
    validate() {
        if (!this.email || !this.password) {
            throw new Error('이메일과 비밀번호를 입력해주세요.');
        }
    }
}
module.exports = LoginRequestDTO;