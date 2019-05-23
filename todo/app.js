let express = require('express');//引入express

let todoController = require('./controller/todoController')//自定义模块todoController

let app = express();//实例化express对象

app.set('view engine','ejs');//配置视图渲染规则按照ejs渲染

// app.use('/public',express.static('public'))
//等同于
app.use(express.static('./public'))//配置静态资源模块化，让浏览器识别

todoController(app)

app.listen(3000)//监听端口号