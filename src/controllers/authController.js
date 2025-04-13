const JoinRequestDTO = require('../dtos/auth/JoinRequestDTO');
const LoginRequestDTO = require('../dtos/auth/LoginRequestDTO');
const CustomError = require('../lib/errors/CustomError');
const { ERROR_CODES } = require('../lib/errors/error-codes');
const { asyncHandler } = require('../lib/utils/express/asyncHandler');
const { createUser, getUserByEmail, reissueAccessToken: reissueAccessTokenService, removeRefreshToken, deleteUser: deleteUserService } = require('../services/authService');

// 회원가입 컨트롤러 
exports.joinUser = asyncHandler(async (req, res, next) => {
    const joinDto = new JoinRequestDTO(req.body);
    const userResponse = await createUser(joinDto);
    return res.status(201).json(userResponse.toJson());
});

// 로그인 컨트롤러 
exports.login =  asyncHandler(async (req, res, next) => {
    const loginDto = new LoginRequestDTO(req.body);
    const { userResponse, accessToken, refreshToken } = await getUserByEmail(loginDto);
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: false,
        maxAge: parseInt(process.env.JWT_COOKIE_EXPIRES_IN_MS), 
    })
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        maxAge: parseInt(process.env.JWT_REFRESH_COOKIE_EXPIRES_MS),
    });
    return res.status(200).json({
        user: userResponse.toJson(), 
        accessToken 
    });
});

// 액세스 토큰 재발급 컨트롤러 
exports.reissueAccessToken =  asyncHandler(async (req, res, next) => {
    const { userResponse, newAccessToken } = await reissueAccessTokenService(req.user.id, req.cookies.refreshToken);
    res.cookie('accessToken', newAccessToken, {
        httpOnly: true,
        secure: false,
        maxAge: parseInt(process.env.JWT_COOKIE_EXPIRES_IN_MS),
    });
    
    return res.status(200).json({
        user: userResponse.toJson(),
        newAccessToken,
    
    });
});

// 로그아웃 컨트롤러 
exports.logout =  asyncHandler(async (req, res, next) => {
    await removeRefreshToken(req.user.id);
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return res.status(200).json({ message: '로그아웃 성공'}); 
});

// 회원탈퇴 컨트롤러 
exports.deleteUser =  asyncHandler(async (req, res, next) => {
    const userResponse = await deleteUserService(req.user.id);
    return res.status(200).json(userResponse.toJson());
});