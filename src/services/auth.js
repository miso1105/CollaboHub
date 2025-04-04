const { wrapService: wrap } = require('../lib/utils/wrapService');
const { findUserByEmail, findUserByUserName, createUser: createUserRepo, updateRefreshToken, findUserById, removeRefreshToken: removeRefreshTokenRepo, deleteUser: deleteUserRepo } = require('../repositories/auth');
const bcrypt = require('bcrypt');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../config/jwt');
const { UserResponseDTO } = require('../dtos/auth');
const { ERROR_CODES, CustomError } = require('../lib/errors');
const { validateEmail, validatePassword } = require('../lib/utils/validateRequest');
const getConnection = require('../config/db');

// 회원 생성 
exports.createUser = wrap(async (dto) => {
        const { userName, email, developmentField, password } = dto;
        const connection = await getConnection();

        try {
            await connection.beginTransaction();

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

            await connection.commit()
            return userResponse;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
});

// 가입된 회원인지 확인  
exports.getUserByEmail = wrap(async (dto) => {
        const { email, password } = dto;
        const connection = await getConnection();

        try {
            await connection.beginTransaction();
            
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
            
            await connection.commit();
            return { userResponse, accessToken, refreshToken };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
});

// 액세스 토큰 재발급 
exports.reissueAccessToken = wrap(async (userId, refreshToken) => {
        const connection = await getConnection();
    try {
        await connection.beginTransaction();
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
        
        await connection.commit();
        return { userResponse, newAccessToken };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
});

// 로그아웃 시 저장된 리프레시 토큰 삭제 
exports.removeRefreshToken = wrap(async (userId) => {
    const connection = await getConnection();
    try {
        await connection.beginTransaction();
        const user = await findUserById(connection, userId);
        await removeRefreshTokenRepo(connection, user.id);
        await connection.commit();
    } catch (error) {
        await connection.rollback();
    } finally {
        connection.release();
    }
});

// 회원탈퇴 
exports.deleteUser = wrap(async (userId) => {
    const connection = await getConnection();
    try {
        await connection.beginTransaction();
        const user = await findUserById(connection, userId);
        if (!user) {
            throw new CustomError(ERROR_CODES.NOT_FOUND, '유저를 찾을 수 없습니다.');
        }
        await deleteUserRepo(connection, userId);
        const userResponse = new UserResponseDTO(user);

        await connection.commit();
        return userResponse;
    } catch (error) {
        await commit.rollback();
        throw error;
    } finally {
        connection.release(); 
    }
});