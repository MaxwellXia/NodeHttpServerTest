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
            //TODO:Content-TypeӦ�ø����ļ���������
            res.writeHead(200, { "Content-Type": "text/plain", "Content-Length": stats.size });

            //ʹ��Stream
            var stream = fs.createReadStream(url);
            var count = 0;

            stream.on('data', function (chunk) {
                //console.log(chunk);
                console.log("�������ݴ�����" + (++count).toString());
                console.log(chunk.length);
                res.write(chunk);
            });

            stream.on('end', function () {
                count = 0;
                console.log("����");
                res.end();
            });

            stream.on('error', function () {
                count = 0;
                console.log("����");
                res.end();
            });
        }
    );
}