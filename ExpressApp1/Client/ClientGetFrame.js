var fs = require('fs');

exports.GetFrame = function (req, res)
{
    var url = req.body['URL'];

    var fileStat = fs.stat(url,
        function (err, stats) {
            if (err) {
                response.writeHead(404);
                response.end();
                return null;
            }
            //TODO:Content-Type应该根据文件类型设置
            res.writeHead(200, { "Content-Type": "text/plain", "Content-Length": stats.size });

            //使用Stream
            var stream = fs.createReadStream(url);
            var count = 0;

            stream.on('data', function (chunk) {
                //console.log(chunk);
                console.log("请求数据次数：" + (++count).toString());
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
}