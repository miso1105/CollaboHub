const { verifyAccessToken } = require('../middlewares/authMiddleware');
const { getComment, updateComment, deleteComment } = require('../controllers/commentController');

const exporess = require('express');
const router = exporess.Router();

router.get('/:id', getComment);
router.patch('/:id', verifyAccessToken, updateComment);
router.delete('/:id', verifyAccessToken, deleteComment);

module.exports = router;