var fs = require("fs");
var onlineUserInfo = new Array();

exports.Login = function (req, res)
{
    var fileLoc = './Client/user.json';

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
                    onlineUserInfo.push({ "ip": req.ip, "index": index,"lastActivityTime":});
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

