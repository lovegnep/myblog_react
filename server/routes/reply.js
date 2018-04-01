const express = require('express');
const router = express.Router();
const config = require('../config');
const Async = require('async');
let models     = require('../model');
let Theme      = models.Theme;
let Reply      = models.Reply;

router.post('/theme/:id/reply',function (req,res,next) {//添加回复
    let _id = req.params.id;
    let content = req.body.t_content;
    let replyid = req.body.reply_id;
    let lou = req.body.lou;

    if(content === ''){
        return res.send({status:0,message:'回复内容不能为空'});
    }
    if(!replyid || replyid === ''){//针对文章进行评论
        Theme.findById(_id,function (err,theme) {
            if(err){
                return res.send({status:0,message:'未知错误'});
            } else if(theme){
                if(theme.deleted){
                    return res.send({status:0,message:'文章已被删除'});
                }else{
                    theme.reply_count += 1;
                    theme.save();
                    let reply = new Reply();
                    reply.theme_id = _id;
                    reply.content = content;
                    //reply.reply_id = replyid;
                    reply.lou = lou;
                    reply.save();
                    return res.send({status:1,message:'评论成功',data:reply});
                }
            }else{
                return res.send({status:0,message:'不存在该文章'});
            }
        });
    }else{
        Async.parallel([function(cb){
            Theme.findById(_id,function (err,theme) {
                if(err){
                    return cb('未知错误', null);
                } else if(theme){
                    if(theme.deleted){
                        return cb('文章已被删除', null);
                    }else{
                        return cb(null, theme);
                    }
                }else{
                    return cb('不存在该文章', null);
                }
            });
        }, function(cb){
            Reply.findById(replyid,function(err,doc){
                if(err){
                    return cb("未知错误", null);
                }
                if(doc){
                    return cb(null, doc);
                }else{
                    return cb('没有此回复', null)
                }
            });
        }],function(err, results){
            if(err){
                return res.send({status:0,message:err});
            }
            let theme = results[0];
            let targetreply = results[1];

            theme.reply_count += 1;
            theme.save();

            let reply = new Reply();
            reply.theme_id = _id;
            reply.content = content;
            reply.reply_id = replyid;
            reply.lou = lou;
            reply.save();

            return res.send({status:1,message:'添加回复成功',data:reply});
        });
    }

});
router.post('/reply/:replyid/replyopt',function (req,res,next) {
    let replyid = req.params.replyid;
    let flag = req.body.flag;
    let actiontype = req.body.act;
    let data={};
    Reply.findById(replyid,function(err,doc){
        if(err){
            data.status=0;
            data.message='数据库错误';
        }
        if(doc){
            if(actiontype === 1){//赞
                if(flag){
                    doc.ups += 1;
                }else{
                    doc.ups -= 1;
                }
            }else{//踩
                if(flag){
                    doc.downs += 1;
                }else{
                    doc.downs -= 1;
                }
            }
            doc.save();
            data.status=1;
        }else{
            data.status = 0;
            data.message = '查无此回复';
        }
        res.send(data);
    });
});
module.exports = router;
