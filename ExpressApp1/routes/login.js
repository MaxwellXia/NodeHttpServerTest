'use strict';
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res) {
    //res.send('this is login page');
    //res.sendFile('F:/1.png');

   // var file = 'E:/2017-09-07-raspbian-stretch.img';

    var fs = require('fs');
    var ws = fs.createWriteStream('out.txt');

    //为流绑定一个open和close事件，来监听流是否打开和关闭
    ws.once("open", function () {
        console.log("流打开了~~~");
    });

    ws.once("close", function () {
        console.log("流关闭了~~~");
    });

    //通过可写流向文件中输出内容
    ws.write("O(∩_∩)O哈哈~");
    ws.write("O(∩_∩)O~");

    //关闭流
    ws.end();
    
});

router.post('/', function (req, res) {
    res.send('respond with a resource');
});

module.exports = router;
