const { verifyAccessToken } = require('../middlewares/authMiddleware');
const { createRecruit, getRecruitById, getRecruits, getMyRecruits, updateRecruit, deleteRecruit } = require('../controllers/recruitController');
const express = require('express'); 
const router = express.Router();

router.post('/', verifyAccessToken, createRecruit);
router.get('/', getRecruits);
router.get('/my', verifyAccessToken, getMyRecruits);
router.get('/:id', getRecruitById);
router.patch('/:id', verifyAccessToken , updateRecruit);
router.delete('/:id', verifyAccessToken, deleteRecruit);

module.exports = router;