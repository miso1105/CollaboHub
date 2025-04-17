const CustomError = require('../lib/errors/CustomError');
const { ERROR_CODES } = require('../lib/errors/error-codes');
const { getAccessTokenPayload, getRefreshTokenPayload } = require('../config/jwt');
const { validateProject } = require('../lib/utils/validation/validateProject');
const getConnection = require('../config/db');
const { validateUser } = require('../lib/utils/validation/validateUser');
const { findCollaboratorByUserIdAndProjectId } = require('../repositories/collaboratorRepository');

// access token 검증 후 인증시에 사용할 유저 정보 넣어줌    
exports.verifyAccessToken = (req, res, next) => {
    try {
        const token = req.cookies.accessToken;
        if (!token) {
            throw new CustomError(ERROR_CODES.UNAUTHORIZED, '엑세스 토큰이 없습니다.');
        }
        const payload = getAccessTokenPayload(token);
        req.user = payload;
        next();
    } catch (error) {
        next(error);
    }
};

// refresh token 검증 후 액세스 토큰 재발급 시에 사용할 유저 정보 넣어줌
exports.verifyRefreshToken = (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            throw new CustomError(ERROR_CODES.UNAUTHORIZED, '리프레시 토큰이 없습니다.');
        }
        
        const payload = getRefreshTokenPayload(refreshToken);
        req.user = payload;
        next();
    } catch (error) {
        next(error);
    }
};

// 프로젝트 생성 시 유저의 role이 leader인지 확인하고 요청에서 사용할 유저 정보 넣어줌 
exports.verifyLeader = (req, res, next) => {
    try  {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new CustomError(ERROR_CODES.UNAUTHORIZED, '액세스 토큰이 없습니다.');
        }
        const token = authHeader.split(' ')[1];
        const payload = getAccessTokenPayload(token);
        if (payload.role !== 'leader') {
            throw new CustomError(ERROR_CODES.FORBIDDEN, '리더 권한을 가지고 있지 않습니다.');
        }
        req.user = payload;
        next();
    } catch (error) {
        next(error);
    }
};

// 프로젝트에 참여 중인 유저인지 검증 
exports.verifyCollaborator = async (req, res, next) => {
    const connection = await getConnection();
    try {
        await connection.beginTransaction();
        const projectId = req.params.projectId;
        const userId = req.user.id;
        await validateProject(connection, projectId);
        await validateUser(connection, userId);
        const result = await findCollaboratorByUserIdAndProjectId(connection, userId, projectId);
        if (result.length === 0) {
            throw new CustomError(ERROR_CODES.FORBIDDEN, '해당 프로젝트에 참여 중인 멤버가 아닙니다.');
        }
        await connection.commit();
        next();
    } catch (error) {
        await connection.rollback();
        next(error);
    } finally {
        connection.release();
    }
};