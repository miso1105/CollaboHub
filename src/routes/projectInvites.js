const express = require('express');
const { verifyAccessToken, verifyLeader } = require('../middlewares/authMiddleware');
const router = express.Router();
const { sendInvite, getMyInvites, getSentInvites, getInvitesByUserId, respondToInvite, deleteInvite } = require('../controllers/projectInviteController');

// 초대 생성 (리더 전용)
router.post('/', verifyAccessToken, verifyLeader, sendInvite);

// 내가 받은 초대 목록 조회 
router.get('/my', verifyAccessToken, getMyInvites);

// 내가 보낸 초대 목록 조회 (리더 전용) 
router.get('/sent', verifyAccessToken, verifyLeader, getSentInvites);

// 특정 유저의 전체 초대 내역 조회 (관리자 전용)   
router.get('/:userId', getInvitesByUserId);

// 초대 응답 처리 (수락 / 거절) 
router.patch('/:inviteId/respond', verifyAccessToken, respondToInvite);

// 초대 취소  (리더 전용) 
router.delete('/:inviteId', verifyAccessToken, verifyLeader, deleteInvite);

module.exports = router;