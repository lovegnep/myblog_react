const express = require('express');
const router = express.Router();
const config = require('../config');
let models     = require('../model');
let Theme      = models.Theme;
let Reply      = models.Reply;
let statics = require('../statistics');
let dataopt = require('../dataWrapper/dataopt');
let canvas = require('../canvas-img/validate');
router.get('/count', function(req, res, next){//请求访问次数
    let client = dataopt.redisClient;
    client.get('viewCount', function(err, data){
        if(err){
            console.log('count:', err);
            return next(err);
        }
        res.send({data:data, status:1});
    });
});


router.post('/getTypeList', function(req, res, next){//请求主题类别
    console.log('getTypeList');
    let client = dataopt.redisClient;
    client.smembers('types', function(err, data){
       if(err){
           console.log('getTypeList:', err);
           return next(err);
       }
       if(!data || data.length < 1){
           client.sadd('types', 'all', function(err, data){
              if(err){
                  console.log('getTypeList: add all to types failed.');
              }
              console.log('getTypeList: add all to types success.');
           });
           res.send({data:['all'], status:1});
       }else{
           res.send({data:data, status:1});
       }

    });
});

router.post('/getThemeList', function(req, res, next){
    let tab = req.body.tab || 'all';
    let page = req.body.page || 1;
    let limit = config.list_topic_count;
    let options = { skip: (page - 1) * limit, limit: limit, sort: '-update_at'};
    let query = {
        deleted: false
    };
    if(tab && tab !== 'all'){
        query.tab = tab;
    }
    if(!req.session.user || req.session.user !== 'admin'){
        query.secret = false;
    }
    console.log('opt:', query, options);
    Theme.find(query, {}, options, function (err, themes) {
        if(err){
            console.log("err");
            return next(err);
        }
       
        console.log('get data success:', themes);
        res.send({data:themes || [], status:1});
    });
});

router.get('/themeCount', function(req, res, next){
    Theme.count({secret:false},function (err,count) {
        if(err){
            console.log("err");
            return next(err);
        }
        res.send({data:count, status:1});
    });
});

router.get('/viewMost', function(req, res, next){
    //查询前3个浏览最多的主题
    Theme.find({deleted:false,secret:false},{},{limit:3,sort:'-visit_count'},function (err,themes){
        if(err){
            console.log("err");
            return next(err);
        }
        res.send({data: themes, status: 1});
    });
});

router.get('/commentMost', function(req, res, next){
    Theme.find({deleted:false,secret:false},{},{limit:3,sort:'-reply_count'},function (err,themes) {
        if(err){
            console.log("err");
            return next(err);
        }
        res.send({data:themes, status: 1});
    });
});

router.get('/iconSrc', function(req, res, next){
    let client = dataopt.redisClient;
    client.get('iconSrc', function(err, data){
        console.log('iconSrc:', data);
        if(err){
            console.log('iconSrc: ', err);
            return next(err);
        }else if(!data){
            res.send({data:'/img/favicon.ico', status:1}); 
        }else{
            res.send({data: data, status:1});
        }

    });
});

router.post('/loginImg', function(req, res, next){
    var imgdata = canvas.create();
    req.session.code = imgdata.code;
    res.send({data:imgdata.data, status: 1});
    
});

router.post('/login',function(req, res, next){
  var name = req.body.name;
  var pass = req.body.pass;
  var code = req.body.code;
console.log(name,pass,code);
function gen_session(res) {
    var opts = {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 30,
        signed: true,
        httpOnly: true
    };
    res.cookie(config.auth_cookie_name, config.auth_cookie_val, opts); //cookie 有效期30天
}
if(!req.session.code){
console.log('会话不存在');
}else{
console.log('code=',req.session.code);
}
  if(!req.session.code || req.session.code !== code){
      //var imgdata = canvas.create();
      //req.session.code = imgdata.code;
    res.send({status:0,err:'验证码不正确'}) ;
    return;
  }
  if(name === config.la && pass === config.lb){
      gen_session(res);

    res.send({status:1,err:''});
  }else{
    res.send({status:0,err:'帐号或者密码不正确'});
  }
});

module.exports = router;
