const express = require('express');
const router = express.Router({ mergeParams: true });
const { verifyAccessToken, verifyCollaborator } = require('../middlewares/authMiddleware');
const { createTask, getTasksByProjectId, getTaskById, updateTask, deleteTask } = require('../controllers/taskController'); 

// 프로젝트 내 작업 생성
router.post('/', verifyAccessToken, verifyCollaborator, createTask);

// 프로젝트 내 모든 작업 조회 
router.get('/', verifyAccessToken, verifyCollaborator, getTasksByProjectId);

// 프로젝트 내 작업 단건 조회 
router.get('/:taskId', verifyAccessToken, verifyCollaborator, getTaskById);

// 프로젝트 내 작업 수정  
router.patch('/:taskId', verifyAccessToken, verifyCollaborator, updateTask);

// 프로젝트 내 작업 삭제 
router.delete('/:taskId', verifyAccessToken, verifyCollaborator, deleteTask);

module.exports = router; 