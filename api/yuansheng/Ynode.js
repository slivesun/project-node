const http = require('http'); //原生node 自带模块
const url = require('url');
const fs = require('fs');
const path = require('path')
let node_uuid = require('node-uuid'); //生成uuid
const port = 5555; //服务端口
// 引入文件数据
const userData = path.join(__dirname, './user.json')
const server = http.createServer((req, res) => {
    // 获取url的各个部分
    // url.parse可以将req.url解析成一个对象
    // 里面包含有pathname和querystring等
    console.log(req.url, 'req')
    // console.log(res,'res')
    const urlObj = url.parse(req.url)
    // console.log(urlObj,'urlObj')
    const {
        pathname
    } = urlObj;
    // console.log(pathname, 'pathname')

    // api开头的是API请求
    if (pathname.startsWith('/api')) {
        // 路由判断
        if (pathname == '/api/users') {
            // 获取http请求动词，方式
            const method = req.method;
            if (method == 'GET') { //如果说是get请求方式
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                fs.readFile(userData, 'utf-8', (err, datastr) => {
                    // console.log(datastr, 'datastr')
                    let user = JSON.parse(datastr) || []
                    user = user.map((item) => {
                        if (item.id) {
                            return item
                        }
                    }).filter((_) => _)
                    
                    setTimeout(() => {
                        console.log('读数据成功')
                        res.end(JSON.stringify({
                            code: 200,
                            data: user.reverse() || [],
                            message: '成功'
                        }))
                    }, 1000)
                })
                return
            } else if (method == "POST") {
                // 注意数据传过来可能有多个chunk
                // 我们需要拼接这些chunk
                let postData = ''
                res.setHeader('Content-Type', 'application/json;charset=utf-8');
                req.on('data', chunk => {
                    // console.log(chunk, 'chunk')
                    postData = postData + chunk
                })
                req.on('end', () => {
                    // 数据传完后往db.txt插入内容
                    // fs.appendFile(path.join(__dirname, 'db.txt'), postData, () => {
                    //     res.end(postData)
                    // })
                    let postDatatemp = {
                        ...JSON.parse(postData),
                        id: node_uuid.v4()
                    }
                    // console.log(postDatatemp, 'postDatatemp')
                    fs.readFile(userData, 'utf-8', (err, dataStr) => {
                        if (err) return
                        // console.log(dataStr, 'data')
                        let data = JSON.parse(dataStr) || []
                        data.push(postDatatemp)
                        fs.writeFile(userData, JSON.stringify(data), (err) => {
                            if (err) {
                                return console.log('写入失败')
                            }
                            console.log('写入成功')
                            res.end(JSON.stringify({
                                code: 200,
                                data: true,
                                message: '新增成功'
                            }))
                        })
                    })
                })
                return
            }
        }
    } else {
        const method = req.method;
        console.log(method, 'dddd')
        // 使用path模块获取文件后缀名
        const extName = path.extname(pathname);
        console.log(extName, 'extName')
        if (extName === '.jpg') {
            // 使用fs模块读取文件
            fs.readFile(path.join(__dirname, pathname), (err, data) => {
                res.setHeader('Content-Type', 'image/jpg');
                res.write(data);
                res.end();
            })

            return
        }
    }
    res.setHeader('Content-Type', 'text/html;charset=utf-8')
    res.end('你好，node.js')
})
server.listen(port, () => {
    console.log('node.js启动了', `访问地址是 http://localhost:${port}`)
})