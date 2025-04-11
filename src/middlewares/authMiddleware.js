const CustomError = require('../lib/errors/CustomError');
const { ERROR_CODES } = require('../lib/errors/error-codes');
const { getAccessTokenPayload, getRefreshTokenPayload } = require('../config/jwt');

// access token 검증 후 인증시에 사용할 유저 정보 넣어줌    
exports.verifyAccessToken = (req, res, next) => {
    try {
        const token = req.cookies.accessToken;
        if (!token) {
            throw new CustomError(ERROR_CODES.UNAUTHORIZED, '엑세스 토큰이 없습니다.');
        }
        const decoded = getAccessTokenPayload(token);
        req.user = decoded;
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
        
        const decoded = getRefreshTokenPayload(refreshToken);
        req.user = decoded;
        next();
    } catch (error) {
        next(error);
    }
};