var fs = require('fs');
var path = require('path');
var resource = path.join(__dirname, '../data/');

exports.GetFrameList = function (req, res)
{
    var fileList = new Array();
    var loc = resource + req.body['FirmwareKind'];

    fs.readdir(loc, function (err, files)
    {
        if (err)
        {
            res.writeHead(500);
            res.end();
        }
        else
        {
            for (var index = 0; index < files.length; index++)
            {
                var sourceName = files[index].toString();
                var target = req.body['FirmwareVersion'].toLocaleLowerCase();
                var source = files[index].toLocaleLowerCase();

                if (null != source.search(target))
                {
                    fileList.push({ "FrameName": files[index], "URL": loc + '\\' + files[index] });
                }
            }

            if (0 != fileList.length) {
                var content = JSON.stringify(fileList);
                res.writeHead(200, { "Content-Type": "application/json", 'Content-Length': content.length });
                res.write(content);
                res.end();
            }
            else {
                res.writeHead(500);
                res.end();
            }
        }
    })
}