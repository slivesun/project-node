const express = require('express');
const app = express();
process.env.G = JSON.stringify({
    g: 'ggg',
    l: 'lll'

    
})

const port = process.env.port || '3000';
app.set('port', port)
app.listen(80, () => {
    console.log("服务启动了")
    console.log(process.env.NODE_ENV, "--全局变量NODE_ENV")
    console.log(process.env.M, "--全局变量M")
    console.log(process.env.H, "--全局变量H")
    console.log(process.env.G, "--全局变量G")
})
//请求url找不到，设置请求状态为404
app.use((req, res) => {
    res.sendStatus(404)
})