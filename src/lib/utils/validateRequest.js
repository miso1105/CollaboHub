exports.validateEmail = (email) => {
    const regex = /^[\w.-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
}
exports.validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!?@#$%^&*_\-]).{8,20}$/;
    return regex.test(password);
}