const express = require('express');
const router = express.Router();
const config = require('../config');
let models     = require('../model');
let Theme      = models.Theme;
let Reply      = models.Reply;
let statics = require('../statistics');
let dataopt = require('../dataWrapper/dataopt');

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
        res.send({data:data, status:1});
    });
});

router.post('/getThemeList', function(req, res, next){
    console.log('getThemeList');
    let tab = req.body.tab || 'all';
    let page = req.body.page || 1;
    let options = { skip: (page - 1) * limit, limit: limit, sort: '-update_at'};
    let query = {
        tab: tab,
        deleted: false
    };
    if(!req.session.user || req.session.user !== 'admin'){
        query.secret = false;
    }
    Theme.find(query, {}, options, function (err, themes) {
        if(err){
            console.log("err");
            return next(err);
        }
        res.send({data:themes, status:1});
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

module.exports = router;
