const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//加载model
require('../models/Users')
const User = mongoose.model('users');

module.exports = (passport) => {
    passport.use(new LocalStrategy(
        {usernameField:'email'},//验证的对象
        (email,password,done) => {
            // console.log(email,password);
            //查询数据库
            User.findOne({email:email})
                .then((user) => {
                    if(!user){
                        return done(null,false,{message:"没有这个用户！"});//是否传对应的内容，得到对应的user，出现错误时的提示
                    }

                    //密码验证
                    bcrypt.compare(password, user.password, function(err, isMatch) {//前台录入密码，后台获取密码，回调函数
                        // res == true
                        if(err) throw err;

                        if(isMatch){
                            //验证成功
                            return done(null,user);//是否传对应的内容，得到对应的user，出现错误时的提示
                        }else{
                            return done(null,user,{message:"密码错误！"});//是否传对应的内容，得到对应的user，出现错误时的提示
                        }
                    });
                })
        }
      ));
        
      //序列化和反序列化 - 保证登录状态持久化
      passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
       
      passport.deserializeUser(function(id, done) {
        User.findById(id, function (err, user) {
          done(err, user);
        });
      });
}

