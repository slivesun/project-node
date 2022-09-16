const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const urlLib = require('http');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
    //mysqlOption 这里应该写到配置文件中，后续再讲这块
const mysqlOption = {
    host: 'xxx',
    user: 'root',
    password: '123456',
    database: 'test'
}
let con = mysql.createConnection(mysqlOption)
app.get('/query', (req, res) => {
    const sql = `select * from xxx`; //数据库的sql语句
    var parseObj = urlLib.parse(req.url, true); //get请求参数
    //拿到get请求(例如参数为id，则获取参数id=parseObj.query.id)，对请求的参数做判断或者逻辑处理
    try {
        con.query(sql, (require, response) => {
            //返回给前端的数据
            res.json(new Result({ data: response }))
        })
    } catch {
        res.json(new Result({ code: '0', msg: '请求失败' }))
    }

})

app.post('/query', (req, res) => {
    const sql = `select * from xxx`; //数据库的sql语句
    const params = req.body; //post 请求的参数
    //拿到post请求params(例如参数为name,获取参数name=params.name)，对请求的参数做判断或者逻辑处理
    try {
        con.query(sql, (require, response) => {
            //返回给前端的数据
            res.json(new Result({ data: response }))
        })
    } catch {
        res.json(new Result({ code: '0', msg: '请求失败' }))
    }
})

function Result({ code = '1', msg = '请求成功', data = {} }) {
    this.code = code;
    this.msg = msg;
    this.data = data;
}

const port = process.env.port || '3000';
app.set('port', port)
app.listen(80, () => {
        console.log("服务启动了")
    })
    //请求url找不到，设置请求状态为404
app.use((req, res) => {
    res.sendStatus(404)
})