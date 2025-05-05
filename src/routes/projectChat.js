const express = require('express');
const router = express.Router({ mergeParams: true });
const { verifyAccessToken, verifyCollaborator } = require('../middlewares/authMiddleware');
const { enterProjectChat, sendProjectChat, deleteMyChat, getChatHistory } = require('../controllers/projectChatController');

// 채팅방 입장 검증 
router.get('/enter', verifyAccessToken, verifyCollaborator, enterProjectChat);  
// 채팅 전송 
router.post('/', verifyAccessToken, verifyCollaborator, sendProjectChat);      
// 본인 채팅 삭제  
router.delete('/:chatId', verifyAccessToken, verifyCollaborator, deleteMyChat); 
// 채팅 목록 조회 
router.get('/', verifyAccessToken, verifyCollaborator, getChatHistory);  

module.exports = router;