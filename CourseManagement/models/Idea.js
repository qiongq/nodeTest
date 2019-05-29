//文件名首字母大写代表数据模型

const mongoose = require('mongoose');//引入mongoose

const Schema = mongoose.Schema;

const IdeaSchema = new Schema({
    title: {
        type:String,
        require:true
    },
    user:{
        type:String,
        require:true
    },
    details: {
        type:String,
        require:true
    },
    date: {
        type:Date,
        default:Date.now
    },
})

mongoose.model('ideas',IdeaSchema);//将IdeaSchema放到模型中