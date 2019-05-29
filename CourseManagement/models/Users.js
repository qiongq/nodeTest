//文件名首字母大写代表数据模型

const mongoose = require('mongoose');//引入mongoose

const Schema = mongoose.Schema;

const UsersSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    date: {
        type:Date,
        default:Date.now
    },
})

mongoose.model('users',UsersSchema);//将IdeaSchema放到模型中