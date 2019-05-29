const express = require('express');
const exphbs = require('express-handlebars');//引入handlebars
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride  = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const passport = require('passport');



const app = express();

//加载路由
const ideas = require('./routes/ideas')
const users = require('./routes/users')


require('./config/passport')(passport);

const db = require('./config/database')

//链接数据库
mongoose.connect(db.mongoURL,{useNewUrlParser:true})//‘mongodb://localhost’为本地数据库地址，‘node-app’为此项目链接的数据库名称为自定义名称
    .then(() => {
        console.log('数据库链接成功！')
    })
    .catch((err) => {
        console.log(err);
    })

//引入模型
require('./models/Idea');
const Idea = mongoose.model('ideas')


//handlebars middleware
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));//设置入口文件，文件路径为views/layouts/main.handlebars
//设置模板引擎
app.set('view engine', 'handlebars');

//body-parser 中间件
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

//method-override 中间件
app.use(methodOverride('_method'));

//session 中间件
app.use(session({
    secret: 'secret',//秘钥，自定义
    resave: true,
    saveUninitialized: true,
  }))

app.use(passport.initialize());
app.use(passport.session());

//flash 中间件
app.use(flash());

//使用静态文静
app.use(express.static(path.join(__dirname,'public')));

//配置全局变量
app.use((req,res,next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});


//配置路由
app.get('/',(req,res) => {
    const title = '大家好，我是茕茕'
    res.render('index',{title:title});
})
app.get('/about', (req, res) => {
    res.render('about');
})



//使用routes
app.use('/ideas',ideas);//第一个参数设置成‘/’时，路由中ideas的原文件不变，设置成‘/ideas’时，原文件接口中的‘/ideas’可全部删除不用
app.use('/users',users);


//监听
const port = process.env.PORT || 5000;
app.listen(port,() =>{
    console.log(`Server started on ${port}`);
});