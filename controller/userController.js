var userController = module.exports = {};
var session = require('express-session');
var bcrypt = require('bcryptjs');
var User= require('./../models').User;
userController.clear = function(req)
{
    delete req.session["error"];
    delete req.session["msg"];
}
userController.login = function(req,res)
{
    res.render('login',{session: req.session});
}
userController.validateLogin= async function(req,res)
{
    var users= await User.findAll({where:{
        email: req.body.emailId
    }});
    console.log(users);
    console.log(req.body);
    if(users.length>0)
    {
        bcrypt.compare(req.body.password, users[0].password, function(err, result) {
            console.log(result);
            if(result===true)
            {
                req.session['userId']=users[0].id;
                res.redirect('/');
            }
            else
            {
                var error="Wrong Credentials";
                res.render("login",{...req.session,error:error});
            }
        });
    }
    else
    {
        var error="Wrong Credentials";
        res.render("login",{...req.session,error:error});
    }
}
userController.signup = function(req,res)
{
    var error="";
    res.render("signup",{...req.session,error:error});
}
userController.validateSignup= async function(req,res)
{
    users= await User.findAll({where:{
        email: req.body.emailId
    }});
    if(users[0])
    {
        error="User Already Exists";
        res.render("signup",{...req.session,error:error});
    }
    else
    {
        bcrypt.hash(req.body.password, 8, async function(err, hash) {
            const user =await User.create({
                name:req.body.name,
                email:req.body.emailId,
                password:hash
            });
            req.session['userId']=user.id;
            res.redirect('/');
        });
    }
}
userController.logOut =async function(req,res)
{
    delete req.session['userId'];
    res.redirect('/');
}