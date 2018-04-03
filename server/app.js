var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var index = require('./routes/index');
var theme = require('./routes/theme');
var reply = require('./routes/reply');
var config = require('./config');
var busboy = require('connect-busboy');
var bytes = require('bytes');
var statics = require('./statistics');
var app = express();
const _ = require('lodash');
function isOriginAllowed(origin, allowedOrigin) {
    if (_.isArray(allowedOrigin)) {
        for(let i = 0; i < allowedOrigin.length; i++) {
            if(isOriginAllowed(origin, allowedOrigin[i])) {
                return true;
            }
        }
        return false;
    } else if (_.isString(allowedOrigin)) {
        return origin === allowedOrigin;
    } else if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
    } else {
        return !!allowedOrigin;
    }
}


const ALLOW_ORIGIN = [ // 域名白名单
    'http://localhost:3000',
    'http://39.108.56.116:3001',
    'http://www.5min8.com:3001',
    'http://www.5min8.com',
    'http://39.108.56.116:3005',
];

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
    let reqOrigin = req.headers.origin; // request响应头的origin属性

    // 判断请求是否在域名白名单内
    if(isOriginAllowed(reqOrigin, ALLOW_ORIGIN)) {
        // 设置CORS为请求的Origin值
        res.header("Access-Control-Allow-Origin", reqOrigin);
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
        res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
        // 你的业务代码逻辑代码 ...
        // ...
    }else{
        return res.send({ code: -2, msg: '非法请求' });
    }

   if(req.signedCookies[config.auth_cookie_name] && req.signedCookies[config.auth_cookie_name] === config.auth_cookie_val) {
       req.session.user='admin';
       res.locals.user='admin';
   }
   next();
});
/*views count statistics*/
app.use('/',statics());

app.use('/', index);
app.use('/', theme);
app.use('/', reply);

module.exports = app;
