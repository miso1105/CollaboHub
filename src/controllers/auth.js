const { JoinRequestDTO, LoginRequestDTO } = require('../dtos/auth');
const { createUser, getUserByEmail, reissueAccessToken: reissueAccessTokenService, removeRefreshToken, deleteUser: deleteUserService } = require('../services/auth');

// 회원가입 컨트롤러 
exports.joinUser = async (req, res, next) => {
    try {
        const joinDto = new JoinRequestDTO(req.body);
        const userResponse = await createUser(joinDto);

        return res.status(201).json(userResponse.toJson());
    } catch (error) {
        next(error);
    }
};

// 로그인 컨트롤러 
exports.login = async (req, res, next) => {
    try {
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
    } catch (error) {
        next(error);
    }
};

// 액세스 토큰 재발급 컨트롤러 
exports.reissueAccessToken = async (req, res, next) => {
    try {
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
    } catch (error) {
        next(error);
    }
};

// 로그아웃 컨트롤러 
exports.logout = async (req, res, next) => {
    try {
        await removeRefreshToken(req.user.id);
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');

        return res.status(200).json({ message: '로그아웃 성공'}); 
    } catch (error) {
        next(error);
    }
};

// 회원탈퇴 컨트롤러 
exports.deleteUser = async (req, res, next) => {
    try {
        const userResponse = await deleteUserService(req.user.id);
        return res.status(200).json(userResponse.toJson());
    } catch (error) {
        next(error);
    }
};