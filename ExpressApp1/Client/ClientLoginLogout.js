var fs = require("fs");
var onlineUserInfo = new Array();
var timeoutPeriodSecond = 180;
var refreshRateMs = 5000;
var SessionID = Array();
var fileLoc = './Client/user.json';

///Maintain online user queuesMaintain online user queues
setInterval(MaintainingUserQueues, refreshRateMs);

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
                    onlineUserInfo.push({ "SessionID": req.ip + index.toString(), "lastActivityTime": process.uptime()});
                    var post_data = { "Head": "ServerLogin", "State": loginState, "SessionID": req.ip + index.toString() };
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
    var index = this.GetOnlineUserIndex(req.body['SessionID']);
    if (index)
    {
        onlineUserInfo.splice(index, 1);
    }
}


exports.UpdateTime = function (sessionID)
{
    var index = this.GetOnlineUserIndex(sessionID);
    onlineUserInfo[index]['lastActivityTime'] = process.uptime();
}


exports.GetOnlineUserIndex = function (sessionID)
{
    for (var index = 0; index < onlineUserInfo.length; index++)
    {
        if (onlineUserInfo[index]["SessionID"] == sessionID)
        {
            return index;
        }
    }

    return null;
}


function MaintainingUserQueues()
{
    for (var index = 0; index < onlineUserInfo.length; index++)
    {
        if (process.uptime() - onlineUserInfo[index]['lastActivityTime'] > timeoutPeriodSecond)
        {
            onlineUserInfo.splice(index, 1);
        }
    }
}