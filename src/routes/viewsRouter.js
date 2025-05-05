const express = require('express');
const router = express.Router();
const { renderChat } = require('../controllers/projectChatController');
const { getInvitedProjects } = require('../controllers/projectController');
console.log(getInvitedProjects);
const { renderLogin } = require('../controllers/authController');
const { verifyAccessToken } = require('../middlewares/authMiddleware');

// 채팅 렌더링
router.get('/projects/:projectId/chat', renderChat);
// 로그인 렌더링
router.get('/login', renderLogin);
// 참여 프로젝트 목록 렌더링 
router.get('/my-chats', verifyAccessToken, getInvitedProjects);

module.exports = router; 