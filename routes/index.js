var express = require('express');
var router = express.Router();
var userController=require('../controller/userController');
var blogController=require('../controller/blogController');
/* GET home page. */
router.get('/', blogController.showAllBlogs);
router.get('/login',userController.login);
router.post('/login',userController.validateLogin);
router.get('/signup',userController.signup);
router.post('/signup',userController.validateSignup);
router.get('/logout',userController.logOut);
router.get('/addPosts',blogController.addBlog);
router.get('/blog/:blogId',blogController.showBlog);
router.get('/blog/delete/:blogId',blogController.deleteBlog);
router.post('/addPosts',blogController.addBlogToDataBase);
router.get('/myBlogs',blogController.showMyBlogs);
module.exports = router;
