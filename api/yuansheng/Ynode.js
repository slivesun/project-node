const http = require('http'); //原生node 自带模块
const url = require('url');
const fs = require('fs');
const path = require('path')
const port = 5555; //服务端口
// 假数据
const userData = [
    {
        id: '2',
        job: '董事长',
        name: '王晗',
        color: 'pink',
        info: `中国科技有限责任公司董事长夫人，持股100%，性感妖娆、温柔贤惠，是公司的一级顶梁柱，资产无法衡量。`
    },  {
        id: '1',
        job: '董事长老公',
        name: '张华',
        color: 'cyan',
        info: `中国科技有限责任公司董事长，持股0%，成熟稳重、凭亿近人，是公司的一级顶梁柱，资产无法衡量。`
    },
    {
        id: '3',
        job: '董事长爱宠',
        name: '张小黑',
        color: 'green',
        info: `中国科技有限责任公司董事长爱宠，持股0%，活泼好动、好吃懒做，是公司的地板砖，资产一袋猫粮，两个碗。`
    },
    {
        id: '3',
        job: '董事长爱宠',
        name: '张小黑',
        color: 'green',
        info: `中国科技有限责任公司董事长爱宠，持股0%，活泼好动、好吃懒做，是公司的地板砖，资产一袋猫粮，两个碗。`
    },
    {
        id: '3',
        job: '董事长爱宠',
        name: '张小黑',
        color: 'green',
        info: `中国科技有限责任公司董事长爱宠，持股0%，活泼好动、好吃懒做，是公司的地板砖，资产一袋猫粮，两个碗。`
    },
    {
        id: '3',
        job: '董事长爱宠',
        name: '张小黑',
        color: 'green',
        info: `中国科技有限责任公司董事长爱宠，持股0%，活泼好动、好吃懒做，是公司的地板砖，资产一袋猫粮，两个碗。`
    },
    {
        id: '3',
        job: '董事长爱宠',
        name: '张小黑',
        color: 'green',
        info: `中国科技有限责任公司董事长爱宠，持股0%，活泼好动、好吃懒做，是公司的地板砖，资产一袋猫粮，两个碗。`
    },
    {
        id: '3',
        job: '董事长爱宠',
        name: '张小黑',
        color: 'green',
        info: `中国科技有限责任公司董事长爱宠，持股0%，活泼好动、好吃懒做，是公司的地板砖，资产一袋猫粮，两个碗。`
    },
]
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
    console.log(pathname, 'pathname')
    // api开头的是API请求
    if (pathname.startsWith('/api')) {
        // 路由判断
        if (pathname == '/api/users') {
            // 获取http请求动词，方式
            const method = req.method;
            if (method == 'GET') { //如果说是get请求方式

                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                setTimeout(() => {
                    res.end(JSON.stringify({
                        code: 200,
                        data: userData,
                        message: '成功'
                    }))
                }, 1000)
                return
            } else if (method == "POST") {
                // 注意数据传过来可能有多个chunk
                // 我们需要拼接这些chunk
                let postData = ''
                res.setHeader('Content-Type', 'application/json;charset=utf-8');
                req.on('data', chunk => {
                    console.log(chunk, 'chunk')
                    postData = postData + chunk
                })
                req.on('end', () => {
                    // 数据传完后往db.txt插入内容
                    fs.appendFile(path.join(__dirname, 'db.txt'), postData, () => {
                        res.end(postData)
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

// server.listen(port, () => {
//   console.log(`Server is running on http://127.0.0.1:${port}/`)
// })