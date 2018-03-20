var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var index = require('./routes/index');
var users = require('./routes/users');
var config = require('./config');
var busboy = require('connect-busboy');
var bytes = require('bytes');
var statics = require('./statistics');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(config.session_secret));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: config.session_secret,
    resave: false,
    saveUninitialized: false,
}));
app.use(busboy({
    limits: {
        fileSize: bytes(config.file_limit)
    }
}));
app.use('/',function (req,res,next) {
    console.log('sone come.....');
    res.header("Access-Control-Allow-Origin", "http://39.108.56.116:3001");
    res.header('Access-Control-Allow-Credentials','true');
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
   if(req.signedCookies[config.auth_cookie_name] && req.signedCookies[config.auth_cookie_name] === config.auth_cookie_val) {
       req.session.user='admin';
       res.locals.user='admin';
   }
   next();
});
/*views count statistics*/
app.use('/',statics());

app.use('/', index);


module.exports = app;
