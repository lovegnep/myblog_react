const express = require('express');
const router = express.Router();
const config = require('../config');
const Async = require('async');
var store        = require('../common/store');
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

router.post('/addnewtype', function(req, res, next){//新增主题类别
    let newtype = req.body.tab;
    let client = dataopt.redisClient;
    client.sadd('types', newtype, function(err, data){
       if(err){
           console.log('addnewtype:', err);
           return next(err);
       }
       res.send({status:1});

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
           /*client.sadd('types', 'all', function(err, data){
              if(err){
                  console.log('getTypeList: add all to types failed.');
              }
              console.log('getTypeList: add all to types success.');
           });*/
           res.send({data:['全部'], status:1});
       }else{
           res.send({data:data, status:1});
       }

    });
});

router.post('/getThemeList', function(req, res, next){
    let tab = req.body.tab || '全部';
    let page = req.body.page || 1;
    let limit = config.list_topic_count;
    let options = { skip: (page - 1) * limit, limit: limit, sort: '-update_at'};
    let query = {
        deleted: false
    };
    if(tab && tab !== '全部'){
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
function gen_session(res) {
    var opts = {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 30,
        signed: true,
        httpOnly: true
    };
    res.cookie(config.auth_cookie_name, config.auth_cookie_val, opts); //cookie 有效期30天
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
router.get('/loginout',function(req,res,next){
    req.session.destroy();
    res.clearCookie(config.auth_cookie_name, { path: '/' });
    res.send({status:1,err:''});
});
router.get('/loginstatus',function(req,res,next){
    if(req.session.user && req.session.user === 'admin'){
        res.send({data:true,status:1});
    }else{
        res.send({data:false,status:1});
    }
});
router.get('/theme/:id', function(req, res, next){
    let _id = req.params.id;
    console.log('id: ', _id);
    Async.parallel([
      function(cb){
        Theme.findOne({_id:_id},{},{},function (err,theme) {
        if(err){
          console.log('err');
          return cb(err);
        }
        if(theme){
          if(theme.deleted){
              return cb('该主题已被删除');
          }else{
            theme.visit_count += 1;
            theme.save();
            return cb(null, theme);
          }
        }else{
           return cb('没有此主题');
        }
    });
      },
      function(cb){
        Reply.find({theme_id:_id},function (err,reply) {
       if(err){
           console.log('error');
           return cb(err);
       }
       reply = reply||[];
       return cb(null, reply);

    });
      }
    ],function(err, results){
      if(err){
        res.send({data:null, status:0});
      }else{
        res.send({data: results, status:1});
       }
    }); 
});
router.post('/upload',function (req,res) {//上传图片
    var isFileLimit = false;
    req.busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
        file.on('limit', function () {
            isFileLimit = true;

            res.json({
                success: false,
                msg: 'File size too large. Max is ' + config.file_limit
            })
        });

        store.upload(file, {filename: filename}, function (err, result) {
            if (err) {
                return next(err);
            }
            if (isFileLimit) {
                return;
            }
            res.json({
                success: true,
                url: result.url,
            });
        });

    });

    req.pipe(req.busboy);
});
module.exports = router;
