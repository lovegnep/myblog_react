var express = require('express');
var router = express.Router();
var config = require('../config');
var models     = require('../model');
var Theme      = models.Theme;
var Reply      = models.Reply;
var eventproxy = require('eventproxy');
var store        = require('../common/store');
var canvas = require('../canvas-img/validate');
var statics = require('../statistics');
function gen_session(res) {
    var opts = {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 30,
        signed: true,
        httpOnly: true
    };
    res.cookie(config.auth_cookie_name, config.auth_cookie_val, opts); //cookie 有效期30天
}

/*16进制转字符串小工具*/
router.get('/str',function(req,res,next){
    res.render('hexToStr', { title: '16进制转字符串'});
});

/* 用户*/
router.get('/', function(req, res, next) {
    console.log('ip:'+req.ip);
console.log("路由访问次数"+res.locals.viewCount.toString());
  var tab = req.query.tab||'all';
  var page = parseInt(req.query.page, 10) || 1;
  page = page > 0 ? page : 1;
    res.locals.sidebar=true;
  var query = {};
  if(tab !== 'all'){
    query.tab = tab;
  }
  var limit = config.list_topic_count;
  var options = { skip: (page - 1) * limit, limit: limit, sort: '-update_at'};
  query.deleted = false;
    if(!req.session.user || req.session.user !== 'admin'){
        query.secret = false;
    }
  var proxy = new eventproxy();
  proxy.all('all','topview','topreply','count',function(t1,t2,t3,c){
    res.locals.topview = t2;
    res.locals.topreply=t3;
    res.locals.count = c;
    res.locals.page=page;
    res.locals.currenttab = tab;
    res.render('index', { title: '好想吃肉',theme:t1});
  });
  //查询主题数量
  Theme.count({secret:false},function (err,count) {
      if(err){
        console.log("err");
      }
      proxy.emit('count',count);
  });
  //查询当前页数据
  Theme.find(query,{},options,function (err, themes) {
      if(err){
        console.log("err");
      }
      proxy.emit('all',themes);
      /*if(themes.length>0){
        proxy.emit('all',themes);
      }*/
  });
  //查询前3个浏览最多的主题
  Theme.find({deleted:false,secret:false},{},{limit:3,sort:'-visit_count'},function (err,themes){
      if(err){
        console.log("err");
      }
      proxy.emit('topview',themes);
      /*if(themes.length>0){
        proxy.emit('topview',themes);
      }*/
  });
  //查询前3个回复最多的主题
  Theme.find({deleted:false,secret:false},{},{limit:3,sort:'-reply_count'},function (err,themes) {
      if(err){
        console.log("err");
      }
      proxy.emit('topreply',themes);
      /*if(themes.length>0){
        proxy.emit('topreply',themes);
      }*/
  })  ;

  


});
router.get('/login',function(req, res, next){

    var imgdata = canvas.create();
    req.session.code = imgdata.code;
    res.render('login',{title:'login',imgdata:imgdata.data});
});
router.post('/login',function(req, res, next){
  var name = req.body.name;
  var pass = req.body.pass;
  var code = req.body.valida_img;

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
router.post('/login/validate_img',function (req,res,next){
    var imgdata = canvas.create();
    req.session.code = imgdata.code;
    res.send({imgdata:imgdata.data});
});
router.get('/admin',function(req, res, next){
  if(typeof(req.session.user) !== 'undefined' && req.session.user === 'admin'){
      var tab = req.query.tab||'all';
      var page = parseInt(req.query.page, 10) || 1;
      page = page > 0 ? page : 1;
      var query = {};
      if(tab !== 'all'){
          query.tab = tab;
      }
      var limit = config.list_topic_count;
      var options = { skip: (page - 1) * limit, limit: limit, sort: '-update_at'};
      query.deleted = false;
      var proxy = new eventproxy();
      proxy.all('all','count',function(t1,c){
          res.locals.count = c;
          res.locals.page=page;
          res.render('admin',{title:'admin',theme:t1,title_e:'',content:''});
          //res.render('index', { title: '好想吃肉',theme:t1});
      });
      //查询主题数量
      Theme.count({},function (err,count) {
          if(err){
              console.log("err");
          }
          proxy.emit('count',count);
      })
      //查询当前页数据
      Theme.find(query,{},options,function (err, themes) {
          if(err){
              console.log("err");
          }
          proxy.emit('all',themes);
          /*if(themes.length>0){
              proxy.emit('all',themes);
          }*/
      });

  }else{
    console.log("wocao");
    res.redirect('/');
  }

});
router.post('/admin',function(req,res,next){
  var tab = req.body.tab;
  var title = req.body.title;
  var t_content = req.body.t_content;
  var allTabs = config.tabs.map(function (tPair) {
        return tPair[0];
  });
  var err='';
  if(title == ''){
    err='标题不能是空的';
  }else if(title.length <= 7 || title.length >= 50){
    err='标题字数太多或者太少';
  }else if(allTabs.indexOf(tab) == -1){
    err='非法类型';
  }else if(t_content==''||t_content.length<=10){
    err='文章内容太少';
  }
  if(err !== ''){
    res.render('admin',{title:'admin',tab:tab,title_e:title,content:t_content,error:err});
    return;
  }
  var theme       = new Theme();
  theme.title     = title;
  theme.content   = t_content;
  theme.tab       = tab;

  theme.save();
  res.render('admin',{title:'admin',tab:'',title_e:'',content:'',error:''});
});
router.get('/search',function(req,res,next){
    var s_q = req.query.q||'';
    var s_tab = req.query.tabs||'';

    var tab = req.query.tab||'all';
    var page = parseInt(req.query.page, 10) || 1;
    page = page > 0 ? page : 1;
    var query = {};
    if(tab !== 'all'){
        query.tab = tab;
    }
    var limit = config.list_topic_count;
    var options = { skip: (page - 1) * limit, limit: limit, sort: '-update_at'};
    query.deleted = false;
    query.secret = false;
    if(s_tab === "title"){
        query.title={$regex:s_q,$options:"$i"};
    }else if(s_tab === "content"){
        query.content ={$regex:s_q,$options:"$i"};
    }
    var proxy = new eventproxy();
    proxy.all('all','topview','topreply','count',function(t1,t2,t3,c){
        res.locals.topview = t2;
        res.locals.topreply=t3;
        res.locals.count = c;
        res.locals.page=page;
        res.locals.currenttab = tab;
        res.render('index', { title: '好想吃肉',theme:t1});
    });
    //查询主题数量
    Theme.count({secret:false},function (err,count) {
        if(err){
            console.log("err");
        }
        proxy.emit('count',count);
    });
    //查询当前页数据
    Theme.find(query,{},options,function (err, themes) {
        if(err){
            console.log("err");
        }
        proxy.emit('all',themes);
        /*if(themes.length>0){
         proxy.emit('all',themes);
         }*/
    });
    //查询前3个浏览最多的主题
    Theme.find({deleted:false,secret:false},{},{limit:3,sort:'-visit_count'},function (err,themes){
        if(err){
            console.log("err");
        }
        proxy.emit('topview',themes);
        /*if(themes.length>0){
         proxy.emit('topview',themes);
         }*/
    });
    //查询前3个回复最多的主题
    Theme.find({deleted:false,secret:false},{},{limit:3,sort:'-reply_count'},function (err,themes) {
        if(err){
            console.log("err");
        }
        proxy.emit('topreply',themes);
        /*if(themes.length>0){
         proxy.emit('topreply',themes);
         }*/
    })  ;





});
router.get('/theme/:id',function (req,res,next) {
    var _id = req.params.id;
    var proxy = new eventproxy();
    res.locals.sidebar=true;

    proxy.all('theme','reply','topview','topreply','count',function (theme,reply,topview,topreply,count) {
        res.locals.topview = topview;
        res.locals.topreply=topreply;
        res.locals.count = count;
        res.render('theme',{title:'theme',theme:theme,reply:reply});
    });
    Reply.find({theme_id:_id},function (err,reply) {
       if(err){
           console.log('error');
           //return;
       }
       reply = reply||[];
       proxy.emit('reply',reply);

    });
    Theme.findOne({_id:_id},{},{},function (err,theme) {
        if(err){
          console.log('err');
          return;
        }
        if(theme){
          if(theme.deleted){
              res.render('theme',{title:'theme',error:'该主题已被删除'});
          }else{
            theme.visit_count += 1;
            theme.save();
            proxy.emit('theme',theme);
            //var cc = markdown.toHTML(theme.content);
            //res.render('theme',{title:'theme',theme:theme});
          }
        }else{
          res.render('theme',{title:'theme',error:'没有此主题'})
        }
    });

    //查询前3个浏览最多的主题
    Theme.find({deleted:false,secret:false},{},{limit:3,sort:'-visit_count'},function (err,themes){
        if(err){
            console.log("err");
        }
        proxy.emit('topview',themes);
        /*if(themes.length>0){
         proxy.emit('topview',themes);
         }*/
    });
    //查询前3个回复最多的主题
    Theme.find({deleted:false,secret:false},{},{limit:3,sort:'-reply_count'},function (err,themes) {
        if(err){
            console.log("err");
        }
        proxy.emit('topreply',themes);
        /*if(themes.length>0){
         proxy.emit('topreply',themes);
         }*/
    })  ;
    //查询主题数量
    Theme.count({secret:false},function (err,count) {
        if(err){
            console.log("err");
        }
        proxy.emit('count',count);
    });
});
router.post('/:id/reply',function (req,res,next) {
   var _id = req.params.id;
   var content = req.body.t_content;
   var replyid = req.body.reply_id;
   var lou = req.body.lou;
   var proxy = new eventproxy();
   if(content === ''){
       res.redirect('/theme/'+_id);
       return;
   }
   proxy.all('theme','reply',function () {
       var reply = new Reply();
       reply.theme_id = _id;
       reply.content = content;
       reply.reply_id = replyid;
       reply.lou = lou;
       reply.save();
       res.redirect('/theme/'+_id);
   });
   if(replyid){
       Reply.findById(replyid,function(err,doc){
           if(err){
               next();
           }
           if(doc){
               proxy.emit('reply',doc);
           }
       });
   }else{
       proxy.emit('reply');
   }
   Theme.findById(_id,function (err,theme) {
      if(err){
          console.log("error");
          return;
      }
       if(theme){
           if(theme.deleted){
               res.redirect('/theme/'+_id);
           }else{
               theme.reply_count += 1;
               theme.save();
               proxy.emit('theme',theme);
           }
       }else{
           res.redirect('/theme/'+_id);
       }
   });
});
router.get('/signout',function(req,res,next){
    req.session.destroy();
    res.clearCookie(config.auth_cookie_name, { path: '/' });
    res.redirect('/');
});
router.post('/upload',function (req,res) {
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
router.post('/reply/:replyid/up',function (req,res,next) {
   var replyid = req.params.replyid;
   var uped = req.body.act;
   var data={};
   Reply.findById(replyid,function(err,doc){
       if(err){
           data.success=false;
           data.message='数据库错误';
       }
       if(doc){
           if(uped == 1){
               doc.ups += 1;
               data.action = 'up';
           }else{
               doc.ups -=1;
               data.action='down';
           }

           doc.save();
           data.success=true;
           //data.action = 'up';
       }
       res.send(data);
   });
});

/*管理员*/
router.post('/theme/:id/delete',function (req,res,next) {
    if(!req.session.user || req.session.user !== 'admin'){
        var data = {success:false,message:'你不是管理员'};
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
       var data={success:true};
       res.send(data);
   });
});
router.post('/theme/:id/edit',function (req,res,next) {
    if(!req.session.user || req.session.user !== 'admin'){
        var data = {success:false,message:'你不是管理员'};
        res.send(data);
        return;
    }
   var themeid = req.params.id;
   var title = req.body.title;
   var tab = req.body.tab;
   var content = req.body.t_content;
   Theme.findById(themeid,function (err,doc) {
      if(err){next()}
      if(doc){
          doc.title = title;
          doc.content = content;
          doc.tab = tab;
          doc.update_at = Date.now();
          doc.save();
          console.log('主题修改成功。');
          res.redirect('/theme/'+themeid);
      }else{

      }
   });
});
router.get('/theme/:id/edit',function (req,res,next) {
    if(!req.session.user || req.session.user !== 'admin'){
        var data = {success:false,message:'你不是管理员'};
        res.send(data.message);
        return;
    }
   var themeid = req.params.id;
   //req.locals.themeid = themeid;
   Theme.findById(themeid,function (err,doc) {
      if(err){next()}
      if( doc && !doc.deleted ){
          res.render('edittheme',{themeid:themeid,tab:doc.tab,title_e:doc.title,content:doc.content});
      }else if(doc && doc.deleted){
          res.render('edittheme',{error:'该主题已经被删除了！'});
      }else if(!doc){
          res.render('edittheme',{error:'找不到该主题！'});
      }
   });
});
router.post('/theme/:id/addsecret',function (req,res,next) {
    if(!req.session.user || req.session.user !== 'admin'){
        var data = {success:false,message:'你不是管理员'};
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
        var data={success:true};
        res.send(data);
    });
});
router.post('/theme/:id/delesecret',function (req,res,next) {
    if(!req.session.user || req.session.user !== 'admin'){
        var data = {success:false,message:'你不是管理员'};
        res.send(data);
        return;
    }
    var themeid = req.params.id;
    var condition = {_id:themeid};
    var updates={$set:{secret:false}};
    Theme.update(condition,updates,function (err,doc) {
        if(err){
            next();
        }
        var data={success:true};
        res.send(data);
    });
});
router.get('/newtheme',function(req,res,next){
    if(typeof(req.session.user) !== 'undefined' && req.session.user === 'admin'){
        res.render('themeCreate',{title:'新建主题',title_e:'',content:''});
    }else{
        console.log("wocao");
        res.redirect('/');
    }
});
module.exports = router;
