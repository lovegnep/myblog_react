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

module.exports = router;
