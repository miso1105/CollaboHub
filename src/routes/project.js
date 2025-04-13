const express = require('express');
const router = express.Router();
const { verifyAccessToken, verifyLeader } = require('../middlewares/authMiddleware');
const { createProject, getAllProjects, getMyProjects, getProjectById, updateProject, deleteProject } = require('../controllers/projectController');

router.post('/', verifyAccessToken, verifyLeader, createProject);
router.get('/', getAllProjects);
router.get('/my', verifyAccessToken, verifyLeader, getMyProjects);
router.get('/:id', getProjectById);
router.patch('/:id', verifyAccessToken, verifyLeader, updateProject);
router.delete('/:id', verifyAccessToken, verifyLeader, deleteProject);

module.exports = router;