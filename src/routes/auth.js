const { verifyAccessToken, verifyRefreshToken } = require('../middlewares/authMiddleware');
const { joinUser, login, reissueAccessToken, logout, deleteUser } = require('../controllers/authController');
const express = require('express');
const router = express.Router();

router.post('/join', joinUser);
router.post('/login', login);
router.post('/logout', verifyAccessToken, logout);
router.post('/reissue', verifyRefreshToken, reissueAccessToken);
router.delete('/withdraw', verifyAccessToken, deleteUser);

module.exports = router;