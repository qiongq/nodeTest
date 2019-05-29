const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const router = express.Router();

const {ensureAuthenticated} = require('../helps/auth')

//引入模型
require('../models/Idea');
const Idea = mongoose.model('ideas')

//body-parser 中间件
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })




router.get('/',ensureAuthenticated, (req, res) => {
    Idea.find({user:req.user.id})
        .sort({date:'desc'})//降序排列
        .then(ideas => {
            res.render('ideas/index',{ideas:ideas});
        })
})

router.get('/add',ensureAuthenticated,(req, res) => {
    res.render('ideas/add');
})

//编辑
router.get('/edit/:id',ensureAuthenticated,(req, res) => {
    Idea.findOne({_id:req.params.id})
        .then(idea => {
            if(idea.user != req.user.id){
                req.flash('error_mag','非法操作！');
                res.redirect('/ideas');
            }else{
                res.render('ideas/edit',{
                    idea:idea
                });
            }
        })
})

//添加
router.post('/',urlencodedParser,(req, res) => {
    // console.log(req.body);
    let errors = [];

    if(!req.body.title){
        errors.push({text:'请输入标题！'})
    }
    if(!req.body.details){
        errors.push({text:'请输入详情！'})
    }

    if(errors.length > 0){
        res.render('ideas/add',{errors:errors,title:req.body.title,details:req.body.details});
    }else{
        // res.send('ok');
        const newUser = {
            title: req.body.title,
            details: req.body.details,
            user:req.user.id
        }

        new Idea(newUser).save()
            .then(idea => {
                req.flash('success_msg','数据添加成功！');
                res.redirect('/ideas')//跳转到对应的地址
            })
    }
})

//编辑
router.put('/:id',urlencodedParser,(req,res) => {
    // res.send('PUT');
    Idea.findOne({
        _id:req.params.id
    })
    .then(idea => {
        idea.title = req.body.title;
        idea.details = req.body.details;

        idea.save()
            .then(() => {
                req.flash('success_msg','数据编辑成功！');
                res.redirect('/ideas')
            })
    })
})

//删除
router.delete('/:id',ensureAuthenticated,(req,res) => {
    console.log(req.body)
    Idea.remove({_id:req.params.id})
        .then(() => {
            req.flash('success_msg','数据删除成功！');
            res.redirect('/ideas');
        })
})


module.exports = router;