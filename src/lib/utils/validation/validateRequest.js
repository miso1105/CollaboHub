const { CustomError, ERROR_CODES } = require("../../errors");

exports.validateEmail = (email) => {
    const regex = /^[\w.-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
};

exports.validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!?@#$%^&*_\-]).{8,20}$/;
    return regex.test(password);
};

exports.validateDate = (deadline) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if(!regex.test(deadline)) {
        throw new CustomError(ERROR_CODES.BAD_REQUEST, "유효한 날짜 형식이 아닙니다. 예: '2025-04-09'");
    }

    const parts = deadline.split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);

    const inputDate = new Date(year, month, day);
    
    const now = new Date();
    if (inputDate < now) {
        throw new CustomError(ERROR_CODES.BAD_REQUEST, '마감일은 오늘 이후로 설정해야 합니다.');
    }

    return true;
};