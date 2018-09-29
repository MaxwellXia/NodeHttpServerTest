var fs = require('fs');
var path = require('path');
var baseAddr = "./Client/ClientData/Device";
var deviceTableName = "deviceTable.json";
var resource = path.join(__dirname, '../data/');

var equipmentScanningCycleMs = 30000;

///Scan the disk to see if the file has changed
setInterval(ScanDocuments, equipmentScanningCycleMs);
function GetStrLen(str)
{
    var realLength = 0;
    for (var i = 0; i < str.length; i++)
    {
        if (str.charCodeAt(i) > 255)
        {
            realLength += 3;
        }
        else
        {
            realLength += 1;
        }
    }
    return realLength;
}


var fileList = new Array();
function GetFileList(filePath)
{
    var dir = fs.readdirSync(filePath);
    if (dir) {
        for (var index = 0; index < dir.length; index++) {
            var fileinfo = fs.statSync(filePath + '/' + dir[index]);
            if (fileinfo.isFile()) {
                fileList.push((filePath + '/' + dir[index]).replace(baseAddr + '/', ''));
            }
            else if (fileinfo.isDirectory()) {
                GetFileList(filePath + '/' + dir[index]);
            }
        }
    }
}


function ParsingFileTable()
{
    fileList = [];
    GetFileList(baseAddr);
    var json = new Array();
    var fd = fs.openSync(baseAddr + "/" + deviceTableName, 'w+');

    for (var index = 0; index < fileList.length; index++)
    {
        if (fileList[index] == deviceTableName)
        {
            continue;
        }

        var arry = fileList[index].split('\\');

        if (arry.length == 4)
        {
            json.push({ "Name": arry[3], "Model": arry[0], "Voriart": arry[1], "Parm": arry[2], "Path": arry[0] + "/" + arry[1] + "/" + arry[2] + "/" + arry[3] });
        }
        else
        {
            var path = "";
            for (var i = 0; i < arry.length; i++)
            {
                if (i != arry.length - 1)
                {
                    path += arry[i] + '/'
                }
                else
                {
                    path += arry[i]
                }
            }
            json.push({ "Name": arry[arry.length - 1], "Path": path });
        }
    }
    fs.writeSync(fd, JSON.stringify(json,null,1));
    fs.closeSync(fd);
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
                    fileList.push({ "FrameName": files[index], "URL": loc + '/' + files[index] });
                }
            }

            if (0 != fileList.length)
            {
                var content = JSON.stringify(fileList);
                res.writeHead(200, { "Content-Type": "application/json", 'Content-Length': GetStrLen(content) });
                res.write(content);
                res.end();
            }
            else
            {
                res.writeHead(500);
                res.end();
            }
        }
    })
}

exports.GetDeviceTable = function(req, res)
{
    if (!fs.existsSync(baseAddr + "/" + deviceTableName))
    {
        ParsingFileTable();
    }

    fs.readFile(baseAddr + '/' + deviceTableName, function (err, data)
    {
        if (err)
        {
            res.writeHead(500);
            res.end();
        }
        else
        {
            res.writeHead(200, { "Content-Type": "application/json", 'Content-Length': data.length });
            res.write(data);
            res.end();
        }
    });
}


function ScanDocuments()
{
    ParsingFileTable();
}