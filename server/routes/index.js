var express = require('express');
var router = express.Router();
var config = require('../config');
var models     = require('../model');
var Theme      = models.Theme;
var Reply      = models.Reply;
var store        = require('../common/store');
var canvas = require('../canvas-img/validate');
var statics = require('../statistics');
let dataopt = require('../dataWrapper/dataopt');

router.get('count', function(req, res, next){
    let client = dataopt.redisClient;
    client.get('viewCount', function(err, data){
        if(err){
            console.log('count:', err);
            next(err);
        }
        res.send({data:data, status:1});
    });
});

router.post('getTypeList', function(req, res, next){
    let client = dataopt.redisClient;
    client.get
});
