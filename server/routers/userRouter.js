const requireUser = require('../middlewares/requireUser');
const userController = require('../controllers/userController');

const router = require('express').Router();

router.post('/follow',requireUser,userController.followOrunfollowUserController);
router.post('/getFeedData', requireUser, userController.getPostsOfFollowing);
router.post('/getMyPost',requireUser,userController.getMyPostsController);
router.get('/getUserPosts',requireUser,userController.getUserPostsController);
router.delete('/',requireUser,userController.deleteMyProfile);
router.get('/getMyInfo',requireUser,userController.getMyInfo);

router.put('/',requireUser,userController.updateUserProfile);
router.post('/getUserProfile', requireUser,userController.getUserProfile);

module.exports = router;