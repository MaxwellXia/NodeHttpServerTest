'use strict';
var express = require('express');
var router = express.Router();

var loc = "E:/2017-09-07-raspbian-stretch.img"
var fs = require("fs");

var count = 0;

/* GET users listing. */
router.get('/', function (req, res) {
    //res.send('this is reg page');
    if (req.method != "GET")
    {
        res.writeHead(403);
        res.end();
        return;
    }

    var sep = req.url.indexOf('?');
    var filePath = sep < 0 ? req.url : req.url.slice(0, sep);
    console.log("GET file: " + filePath);

    //当文件存在时发送数据给客户端，否则404
    var fileStat = fs.stat(loc,
        function (err, stats)
        {
            if (err) {
                response.writeHead(404);
                response.end();
                return null;
            }
            //TODO:Content-Type应该根据文件类型设置
            res.writeHead(200, { "Content-Type": "text/plain", "Content-Length": stats.size });

            //使用Stream
            var stream = fs.createReadStream(loc);

            stream.on('data', function (chunk) {
                //console.log(chunk);
               console.log("请求数据次数：" + (++count).toString() );
                console.log(chunk.length);
                res.write(chunk);
            });

            stream.on('end', function () {
                count = 0;
                console.log("结束");
                res.end();
            });

            stream.on('error', function () {
                count = 0;
                console.log("错误");
                res.end();
            });
        }
    );
});

router.post('/', function (req, res) {
    res.send('respond with a resource');
});

module.exports = router;
