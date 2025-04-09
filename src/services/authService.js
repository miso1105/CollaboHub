const { findUserByEmail, findUserByUserName, createUser: createUserRepo, updateRefreshToken, findUserById, removeRefreshToken: removeRefreshTokenRepo, deleteUser: deleteUserRepo } = require('../repositories/authReository');
const bcrypt = require('bcrypt');
const { generateAccessToken, generateRefreshToken } = require('../config/jwt');
const { UserResponseDTO } = require('../dtos/auth');
const { ERROR_CODES, CustomError } = require('../lib/errors');
const { validateEmail, validatePassword } = require('../lib/utils/validation/validateRequest');
const { withTransaction } = require('../lib/utils/service/withTransaction');

// 회원 생성 
exports.createUser = async (dto) => {
    return withTransaction(async (connection) => {
        const { userName, email, developmentField, password } = dto;

        if (!dto.email || !dto.userName|| !dto.password) {
            throw new CustomError(ERROR_CODES.BAD_REQUEST, '유저네임과 이메일, 비밀번호를 입력해주세요.') 
        }
        if(!validateEmail(email)) {
            throw new CustomError(ERROR_CODES.BAD_REQUEST, '이메일 형식이 잘못됐습니다.', error);
        }
        if(!validatePassword(password)) {
            throw new CustomError(ERROR_CODES.BAD_REQUEST, '비밀번호는 대문자, 소문자, 숫자, 특수문자가 각각 1개 이상 8자 이상 20자 미만으로 입력해주세요.');
        }

        const duplicatedEmail = await findUserByEmail(connection, email);
        if (duplicatedEmail) {
            throw new CustomError(ERROR_CODES.BAD_REQUEST, '이미 존재하는 이메일입니다.');
        }

        const duplicatedUserName = await findUserByUserName(connection, userName);
        if (duplicatedUserName) {
            throw new CustomError(ERROR_CODES.BAD_REQUEST, '이미 존재하는 유저네임입니다.');
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        await createUserRepo(connection, userName, email, developmentField, hashedPassword);

        const user = await findUserByEmail(connection, email);
        const userResponse = new UserResponseDTO(user);
        return userResponse;
    });
};

// 가입된 회원인지 확인  
exports.getUserByEmail = async (dto) => {
    return withTransaction(async (connection) => {
        const { email, password } = dto;
        const user = await findUserByEmail(connection, email); 
        if (!user) {
            throw new CustomError(ERROR_CODES.NOT_FOUND, '존재하지 않는 이메일입니다.');
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            throw new CustomError(ERROR_CODES.NOT_FOUND, '비밀번호가 일치하지 않습니다.');
        }
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        const userResponse = new UserResponseDTO(user);
        await updateRefreshToken(connection, user.id, refreshToken);
        return { userResponse, accessToken, refreshToken };
    });
};

// 액세스 토큰 재발급 
exports.reissueAccessToken = async (userId, refreshToken) => {
    return withTransaction(async (connection) => {
        if (!refreshToken) {
            throw new CustomError(ERROR_CODES.UNATHORIZED, '리프레시 토큰이 없습니다.');
        }
        const user = await findUserById(connection, userId);
        if (!user) {
            throw new CustomError(ERROR_CODES.NOT_FOUND, '유저를 찾을 수 없습니다.');
        }
        if (user.refresh_token !== refreshToken) {
            throw new CustomError(ERROR_CODES.UNATHORIZED, '리프레시 토큰이 유효하지 않습니다.');
        }
        const userResponse = new UserResponseDTO(user);
        const newAccessToken = generateAccessToken(user);
        
        return { userResponse, newAccessToken };
    });
};

// 로그아웃 시 저장된 리프레시 토큰 삭제 
exports.removeRefreshToken = async (userId) => {
    return withTransaction(async (connection) => {
        const user = await findUserById(connection, userId);
        await removeRefreshTokenRepo(connection, user.id);
    });
};

// 회원탈퇴 
exports.deleteUser = async (userId) => {
    return withTransaction(async (connection) => {
        const user = await findUserById(connection, userId);
        if (!user) {
            throw new CustomError(ERROR_CODES.NOT_FOUND, '유저를 찾을 수 없습니다.');
        }
        await deleteUserRepo(connection, userId);
        const userResponse = new UserResponseDTO(user);
        return userResponse;
    });
};