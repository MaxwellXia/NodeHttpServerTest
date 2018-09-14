var fs = require('fs');
var path = require('path');
var resource = path.join(__dirname, '../data/');

function stringToByte(str) {
    var bytes = new Array();
    var len, c;
    len = str.length;
    for (var i = 0; i < len; i++) {
        c = str.charCodeAt(i);
        if (c >= 0x010000 && c <= 0x10FFFF) {
            bytes.push(((c >> 18) & 0x07) | 0xF0);
            bytes.push(((c >> 12) & 0x3F) | 0x80);
            bytes.push(((c >> 6) & 0x3F) | 0x80);
            bytes.push((c & 0x3F) | 0x80);
        } else if (c >= 0x000800 && c <= 0x00FFFF) {
            bytes.push(((c >> 12) & 0x0F) | 0xE0);
            bytes.push(((c >> 6) & 0x3F) | 0x80);
            bytes.push((c & 0x3F) | 0x80);
        } else if (c >= 0x000080 && c <= 0x0007FF) {
            bytes.push(((c >> 6) & 0x1F) | 0xC0);
            bytes.push((c & 0x3F) | 0x80);
        } else {
            bytes.push(c & 0xFF);
        }
    }
    return bytes;
}


function GetStrLen(str)
{
    var realLength = 0, len = str.length, charCode = -1;
    for (var i = 0; i < len; i++) {
        charCode = str.charCodeAt(i);
        if (charCode >= 0 && charCode <= 128) realLength += 1;
        else realLength += 2;
    }
    return realLength;
}

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

            if (0 != fileList.length)
            {
                var content = JSON.stringify(fileList);
                var arry = stringToByte(content);

                str = content;
                var b = 0;
                for (var i = 0, l = str.length; i < l; i++) {
                    if (str.charCodeAt(i) > 255) {
                        b += 3;
                    } else {
                        b++;
                    }
                }


                res.writeHead(200, { "Content-Type": "application/json", 'Content-Length': b });
                
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