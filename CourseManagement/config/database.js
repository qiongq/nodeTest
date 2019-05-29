//配置数据库
if(process.env.NODE_ENV == 'production'){
    //生产环境
    module.exports = {
        mongoURL:'mongodb+srv://qqiong:qqiong@cluster0-5qduq.mongodb.net/test?retryWrites=true'
    }
}else{
    //开发环境
    module.exports = {
        mongoURL:'mongodb://localhost/node-app'
    }
}