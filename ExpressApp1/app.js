'use strict';
var debug = require('debug');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressLayouts = require('express-ejs-layouts');
var serveIndex = require('serve-index');//只能列表目录，不能下载文件？
var serveStatic = require('serve-static');

var routes = require('./routes/index');
var users = require('./routes/users');
var post = require('./routes/post');
var reg = require('./routes/reg');
var login = require('./routes/login');
var logout = require('./routes/logout');
var client = require('./routes/client');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressLayouts);

app.use('/', routes);
app.use('/users', users);
app.use('/post', post);
app.use('/reg', reg);
app.use('/login', login);
app.use('/logout', logout);
app.use('/client', client);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

//app.set('port', process.env.PORT || 3000);

//var server = app.listen(app.get('port'), function () {
//    debug('Express server listening on port ' + server.address().port);
//});

var httpModule = require('http');
var httpsModule = require('https');
var fs = require('fs');

//var https = httpsModule.Server({
//    key: fs.readFileSync('F:/Users/Admin/Desktop/SSL/server.key'),
//    cert: fs.readFileSync('F:/Users/Admin/Desktop/SSL/server.crt')
//}, function (req, res) {
//    res.writeHead(200);
//    res.end("hello world\n");
//});

////https默认de监听端口时443，启动1000以下的端口时需要sudo权限
//https.listen(443, function (err) {
//    console.log("https listening on port: 443");
//});

console.log(__dirname)

//var privateKey = fs.readFileSync('SSL/server.key'); 
//var certificate = fs.readFileSync('SSL/server.crt');
var pxfFile = fs.readFileSync('SSL/server.pfx');
var pwd = '123456';
var credentials = { pfx: pxfFile, passphrase:pwd };

var httpServer = httpModule.createServer(app);
var httpsServer = httpsModule.createServer(credentials, app);

var PORT = 18080;
var SSLPORT = 18081;

httpServer.listen(PORT, function () {
    console.log('HTTP Server is running on: http://localhost:%s', PORT);
});

httpsServer.listen(SSLPORT, function () {
    console.log('HTTPS Server is running on: https://localhost:%s', SSLPORT);
});