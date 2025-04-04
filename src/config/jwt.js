const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { CustomError } = require('../lib/errors/CustomError');
const { ERROR_CODES } = require('../lib/errors/error-codes');

dotenv.config();

// access token 발급
exports.generateAccessToken = (user) => {
    return jwt.sign({
        id: user.id,
        email: user.email,
        role: user.role,
    },
    process.env.JWT_SECRET,
    {
        expiresIn: process.env.JWT_EXPIRES_IN,
        // expiresIn: "1m", // 개발 중 필요할 때만 1분으로!
        issuer: process.env.JWT_ISSUER,
    });
};

// access token 검증 및 payload 추출 
exports.getAccessTokenPayload = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new CustomError(ERROR_CODES.TOKEN_EXPIRED_ERROR, error);
        } else if (error.name === 'JsonWebTokenError') {
            throw new CustomError(ERROR_CODES.INVALID_TOKEN_ERROR, error);
        } else {
            throw new CustomError(ERROR_CODES.INTERNAL_SERVER_ERROR, error);
        }
    }
};

// refresh token 발급
exports.generateRefreshToken = (user) => {
    return jwt.sign(
    {
        id: user.id
    },
    process.env.JWT_REFRESH_SECRET,
    {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
        issuer: process.env.JWT_ISSUER,
    });
};

// refresh token 검증 및 payload 추출 
exports.getRefreshTokenPayload = (refreshToken) => {
    try {
        return jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new CustomError(ERROR_CODES.TOKEN_EXPIRED_ERROR, error);
        } else if (error.name === 'JsonWebTokenError') {
            throw new CustomError(ERROR_CODES.INVALID_TOKEN_ERROR, error);
        } else {
            throw new CustomError(ERROR_CODES.INTERNAL_SERVER_ERROR, error);
        }
    }
};
