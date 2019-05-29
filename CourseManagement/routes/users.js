const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const passport = require('passport');
const router = express.Router();


//body-parser 中间件
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

//加载model
require('../models/Users')
const User = mongoose.model('users');

//登录注册
router.get('/login',(req,res) => {
    res.render('users/login')
})
//注册
router.get('/register',(req,res) => {
    res.render('users/register')
})


//注册
router.post('/register',urlencodedParser,(req,res) => {
    // console.log(req.body);
    // res.send('注册')
    let errors = [];

    if(req.body.password != req.body.password2){
        errors.push({text:'两次密码不一致！'})
    }

    if(req.body.password.length < 4){
        errors.push({text:'密码长度不能小于4！'})
    }

    if(errors.length > 0){
        //有误
        res.render('users/register',{
            errors:errors,
            name:req.body.name,
            email:req.body.email,
            password:req.body.password,
            password2:req.body.password2
        })
    }else{
        // res.send('验证成功！')
        //是否已注册
        User.findOne({email:req.body.email})
            .then((user) => {
                if(user){
                    req.flash('error_msg','邮箱已存在，请更换邮箱注册！');
                    res.redirect('/users/register');
                }else{
                    let newUser = new User({
                        name:req.body.name,
                        email:req.body.email,
                        password:req.body.password,
                    })

                    bcrypt.genSalt(10, function(err, salt) {//密码强度，回调函数
                        bcrypt.hash(newUser.password, salt,(err, hash) =>{//需要加密项，回调函数
                            if(err) throw err;

                            newUser.password = hash;//保存加密结果
                            newUser.save()
                                .then( (user) => {
                                    req.flash('success_msg','账号注册成功！');
                                    res.redirect('/users/login');
                                })
                                .catch( (err) => {
                                    req.flash('error_msg','账号注册失败！');
                                    res.redirect('/users/register');
                                })

                        });
                    });
                }
            })
    }
})

//登录
router.post('/login',urlencodedParser,(req,res,next) => {
    //‘local’为passport实例化的内容
    passport.authenticate('local', { 
        failureRedirect: '/users/login',//验证失败后跳转的页面
        successRedirect: '/ideas',//验证成功后跳转的页面
        failureFlash: true,//失败报错开启
    })(req,res,next)

    //查询数据库
    // User.findOne({email:req.body.email})
    //     .then((user) => {
    //         if(!user){
    //             req.flash('error_msg','用户不存在！')
    //             res.redirect('/users/login');
    //             return false;
    //         }

    //         //密码验证
    //         bcrypt.compare(req.body.password, user.password, function(err, isMatch) {//前台录入密码，后台获取密码，回调函数
    //             // res == true
    //             if(err) throw err;

    //             if(isMatch){
    //                 //验证成功
    //                 req.flash('success_msg','登录成功！');
    //                 res.redirect('/ideas');
    //             }else{
    //                 req.flash('error_msg','密码错误！')
    //                 res.redirect('/users/login');
    //             }
    //         });
    //     })
})

//退出登录
router.get('/logout',(req,res) => {
    req.logout();
    req.flash('success_msg','退出成功！');
    res.redirect('/users/login');
})




module.exports = router;