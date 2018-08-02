// 引入编写好的api
const api = require('./api');
// 引入文件模块
const fs = require('fs');
// 引入处理路径的模块
const path = require('path');
// 引入处理post数据的模块
const bodyParser = require('body-parser');

// 引入db
const db = require('./db');
// 引入Express
const express = require('express');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(api);
// 访问静态资源文件 这里是访问所有dist目录下的静态资源文件
// app.use(express.static(path.join('./index.html')))

// 因为是单页应用 所有请求都走/dist/index.html
app.get('/index', function (req, res) {
    fs.readFile("../index.html", 'utf-8',function(err,data){
      console.log("ddadfasdf"+data);
        res.writeHead(404,{"Content-Type":"text/html"});
        res.write(data);
         res.end();
    });
  // const html = fs.readFileSync('D:/Test/Vue/index.html', 'utf-8');

});
// 监听8088端口
app.listen(8088);
console.log('success listen…………');
