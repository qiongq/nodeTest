//引入mongoose 模块
let mongoose = require('mongoose');
//链接数据库
mongoose.connect('mongodb+srv://zhangqianwen:zhangqianwen@cluster0-n7fzh.mongodb.net/test?retryWrites=true',{useNewUrlParser:true})
//创建图表
let todoSchema  = new mongoose.Schema({
    item:String
})


//往数据库中存储数据
let Todo = mongoose.model('Todo',todoSchema);
let Finish = mongoose.model('Finish',todoSchema);

//测试存储
// Todo({item:'大家好'})
//     .save((err,data) => {
//         if(err) throw err;
//         console.log('保存成功！')
//     })

// Finish({item:'大家好'})
//     .save((err,data) => {
//         if(err) throw err;
//         console.log('保存成功！')
//     })


let bodyParser = require('body-parser');
//对数据进行解析
let urlencodeParser =  bodyParser.urlencoded({extended:false});

// let data = [
//     {item:'欢迎大家来到茕茕课堂练习！'},
//     {item:'希望大家能喜欢我的练习！'},
//     {item:'一个个手敲代码好累哦！'},
// ]

//todoController
module.exports = function (app) {
    //获取数据
    app.get('/todo', (req,res) => {
        // res.render('todo',{todos:data});
        let todos = {};
        Todo.find({},(err,data) => {
            if(err) throw err;
            todos.unfinish = data;
            Finish.find({},(err,data2) => {
                if(err) throw err;
                todos.finish = data2;
                // console.log(todos);
                res.render('todo',{todos:todos});
            })
        })
     })

     //传递数据
     app.post('/todo',urlencodeParser,(req,res) => {
        //coding...
        // console.log(req.body);
        // data.push(req.body);

        Todo(req.body)
            .save((err,data) => {
                if(err) throw err;
                res.json(data);
            })
     })

     //删除数据
     app.delete('/todo/:item',(req,res) => {
         //coding
        //  console.log(req.params.item);
        //  data = data.filter(function (todo) {
        //     return req.params.item != todo.item;
        //   })
        //   res.json(data);

        Todo.find({item:req.params.item})
            .remove((err,data) => {
                if(err) throw err;
                res.json(data);
            })
     })

     app.delete('/todoFinish/:item',(req,res) => {
        //coding
       //  console.log(req.params.item);
       //  data = data.filter(function (todo) {
       //     return req.params.item != todo.item;
       //   })
       //   res.json(data);

       Finish.find({item:req.params.item})
           .remove((err,data) => {
               if(err) throw err;
               res.json(data);
           })
    })

     //完成当前目标
     app.post('/todo/finish',urlencodeParser,(req,res) => {
        //  console.log(req.body);
         let todos = {};
         Todo.find(req.body)
            .remove((err,data) => {
                if(err) throw err;
                todos.unfinish = data;

                Finish(req.body)
                    .save((err,data2) => {
                        if(err) throw err;
                        todos.finish = data2;
                        res.json(todos);
                    })
            })
     })

     //取消完成当前目标
     app.post('/todo/unfinish',urlencodeParser,(req,res) => {
        // console.log(req.body);
        let todos = {};
        Finish.find(req.body)
           .remove((err,data) => {
               if(err) throw err;
               todos.finish = data;

               Todo(req.body)
                   .save((err,data2) => {
                       if(err) throw err;
                       todos.unfinish = data2;
                       res.json(todos);
                   })
           })
    })

 }