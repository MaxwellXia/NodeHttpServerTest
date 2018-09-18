'use strict';
var express = require('express');
var logManagement = require('../Client/ClientLoginLogout');
var getDeviceTable = require('../Client/ClientGetDeviceTable');
var getFile = require('../Client/ClientGetFile');
var router = express.Router();

router.post('/', function (req, res) {
    var head = req.body['Head'];

    //data type error
    if (undefined == head)
    {
        req.writeHead(404);
        req.end;
        return;
    }

    if ('Login' != head && logManagement.GetOnlineUserInfo(req.body['SessionID'],'ip') != req.ip)
    {
        //客户端身份校验失败
    }
    else
    {
        switch (head)
        {
            case 'Login':
                {
                    logManagement.Login(req, res);
                    break;
                }
            case 'Logout':
                {
                    logManagement.Logout();
                }
            case 'ClientGetFile':
                {
                    logManagement.UpdateTime(req.body['SessionID']);
                    getFile.GetFrame(req, res);
                    break;
                }
            case 'ClientGetDeviceTable':
                {
                    logManagement.UpdateTime(req.body['SessionID']);
                    getDeviceTable.GetDeviceTable(req,res);
                    break;
                }
            default:
                {
                    req.writeHead(404);
                    req.end;
                    break;
                }
        }
    }
})






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
