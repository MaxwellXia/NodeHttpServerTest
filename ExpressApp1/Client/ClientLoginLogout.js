var fs = require("fs");
var onlineUserInfo = new Array();
var timeoutPeriod = 180;
var refreshRate = 5000;
var fileLoc = './Client/user.json';

//Maintain online user queuesMaintain online user queues
setInterval(MaintainingUserQueues, refreshRate);

exports.Login = function (req, res)
{
    fs.readFile(fileLoc, function (err,data)
    {
        if (err)
        {
            res.writeHead(500);
            res.end();
        }
        else
        {
            var fileData = JSON.parse(data);
            var loginState = false;
            for (var index = 0; index < fileData.length; index++)
            {
                if (req.body['UserID'] == fileData[index]["ID"] && req.body['Password'] == fileData[index]["pwd"])
                {
                    loginState = true;
                    //To DO:
                    onlineUserInfo.push({ "ip": req.ip, "index": index, "lastActivityTime": process.uptime()});
                    var post_data = { "Head": "ServerLogin", "State": loginState, "SessionID": index };
                    var content = JSON.stringify(post_data);

                    res.writeHead(200, { "Content-Type": "application/json", 'Content-Length': content.length });
                    res.write(content);
                    res.end();
                }
            }

            if (!loginState)
            {
                //Login false
                var post_data = { "Head": "ServerLogin", "State": loginState};
                var content = JSON.stringify(post_data);

                res.writeHead(200, { "Content-Type": "application/json", 'Content-Length': content.length });
                res.write(content);
                res.end();
            }
        }
    });
}


exports.Logout = function(req, res)
{
    for (var index = 0; index < onlineUserInfo.length; index++)
    {
        if (req.ip == onlineUserInfo[indx]["ip"])
        {
            onlineUserInfo.splice(index,1);
        }
    }
}


exports.UpdateTime = function(index)
{
    onlineUserInfo[index]['lastActivityTime'] = process.uptime();
}


function MaintainingUserQueues()
{
    for (var index = 0; index < onlineUserInfo.length; index++)
    {
        if (process.uptime() - onlineUserInfo[index]['lastActivityTime'] > timeoutPeriod)
        {
            onlineUserInfo.splice(index, 1);
        }
    }
}

