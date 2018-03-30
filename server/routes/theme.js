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

router.post('/newtheme',function(req,res,next){//新建文章
  let client = dataopt.redisClient;
  var tab = req.body.tab;
  var title = req.body.title;
  var t_content = req.body.t_content;
  client.sismember('types', tab, function(err, data){
    if(err){
      return res.send({status:0,err:'未知错误'});
    }
    if(data !== 1){
      return res.send({status:0,err:'请先新建该类别'});
    }
  var err='';
  if(title == ''){
    err='标题不能是空的';
  }else if(title.length <= 7 || title.length >= 50){
    err='标题字数太多或者太少';
  }else if(t_content==''||t_content.length<=10){
    err='文章内容太少';
  }
  if(err !== ''){
    res.send({status:0,err:err});
    return;
  }
  var theme       = new Theme();
  theme.title     = title;
  theme.content   = t_content;
  theme.tab       = tab;

  theme.save();
  res.send({status:1,err:"",_id:theme._id});    
  });
});
router.post('/theme/:id/delete',function (req,res,next) {
    if(!req.session.user || req.session.user !== 'admin'){
        var data = {status:0,message:'你不是管理员'};
        res.send(data);
        return;
    }
    var themeid = req.params.id;
    var condition = {_id:themeid};
    var updates={$set:{deleted:true}};
    Theme.update(condition,updates,function (err,doc) {
        if(err){
            next();
        }
        var data={status:1,err:"删除成功"};
        res.send(data);
    });
});
router.post('/theme/:id/edit',function (req,res,next) {
    if(!req.session.user || req.session.user !== 'admin'){
        var data = {status:0,message:'你不是管理员'};
        res.send(data);
        return;
    }
    var themeid = req.params.id;
    var title = req.body.title;
    var tab = req.body.tab;
    var content = req.body.t_content;
    Theme.findById(themeid,function (err,doc) {
        if(err){next(err)}
        if(doc){
            doc.title = title;
            doc.content = content;
            doc.tab = tab;
            doc.update_at = Date.now();
            doc.save();
            res.send({status:1,message:'修改成功'});
        }else{
            res.send({status:0,message:'文章不存在，修改失败'});
        }
    });
});
router.post('/theme/:id/addsecret',function (req,res,next) {
    if(!req.session.user || req.session.user !== 'admin'){
        var data = {status:0,message:'你不是管理员'};
        res.send(data);
        return;
    }
    var themeid = req.params.id;
    var condition = {_id:themeid};
    var updates={$set:{secret:true}};
    Theme.update(condition,updates,function (err,doc) {
        if(err){
            next();
        }
        var data={status:1,message:'隐藏成功'};
        res.send(data);
    });
});
router.post('/theme/:id/delesecret',function (req,res,next) {
    if(!req.session.user || req.session.user !== 'admin'){
        var data = {status:0,message:'你不是管理员'};
        res.send(data);
        return;
    }
    var themeid = req.params.id;
    var condition = {_id:themeid};
    var updates={$set:{secret:false}};
    Theme.update(condition,updates,function (err,doc) {
        if(err){
            next(err);
        }
        var data={status:0,message:'取消隐藏成功'};
        res.send(data);
    });
});
module.exports = router;
