var blogController = module.exports = {};
var session = require('express-session');
var bcrypt = require('bcryptjs');
const { htmlToText } = require('html-to-text');

var User= require('./../models').User;
var Blog= require('./../models').Blog;

blogController.addBlog = function(req,res)
{
    res.render('blogs/add',{...req.session});
}
blogController.addBlogToDataBase =async function(req,res)
{
    var blogs={};
    blogs['AuthorId']=req.session["userId"];
    blogs['title']=req.body.title;
    blogs['content']=req.body.content;
    const blog =await Blog.create(blogs);
    res.redirect('/');
}
blogController.deleteBlog =async function(req,res)
{
    var blogs={};
    blogs['AuthorId']=req.session["userId"];
    blogs['title']=req.body.title;
    blogs['content']=req.body.content;
    const blog =await Blog.destroy({where:{id:req.params.blogId}});
    res.redirect('/');
}
blogController.showAllBlogs = async function(req,res)
{
    req.session["title"]="XYZ Blog";
    var blogs=await Blog.findAll({order:[['createdAt','DESC']]});
    for(i=0;i<blogs.length;i++)
    {
        var author= await User.findAll({where:{
            id:blogs[i].AuthorId
        }});
        blogs[i]['author']=author[0].name;
        blogs[i]['content']=htmlToText(blogs[i]['content']);
        if(blogs[i]['content'].length>400)
        {
            console.log(true);
            blogs[i]['content']=blogs[i]['content'].substring(0,400)+'........';
        }
    }
    res.render('index', {...req.session, blogs:blogs});
}
blogController.showMyBlogs = async function(req,res)
{
    req.session["title"]="XYZ Blog";
    var userId=req.session['userId'];
    var blogs=await Blog.findAll({order:[['createdAt','DESC']],where:{AuthorId:userId}});
    for(i=0;i<blogs.length;i++)
    {
        var author= await User.findAll({where:{
            id:blogs[i].AuthorId
        }});
        blogs[i]['author']=author[0].name;
        blogs[i]['content']=htmlToText(blogs[i]['content']);
        if(blogs[i]['content'].length>400)
        {
            console.log(true);
            blogs[i]['content']=blogs[i]['content'].substring(0,400)+'........';
        }
    }
    res.render('myBlogs', {...req.session, blogs:blogs});
}
blogController.showBlog = async function(req,res){
    var blogId=req.params.blogId;
    var blogs=await Blog.findOne({where:{
        id:blogId
    }});
    var author= await User.findOne({where:{
        id:blogs.AuthorId
    }});
    blogs['author']=author.name;
    res.render('blogs/show', {...req.session, blogs:blogs});
}