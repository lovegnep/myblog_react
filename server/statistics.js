/**
 * Created by Administrator on 2017/11/5.
 */
var redis = require('redis');
function statics(){
    var opts = {
    path: '/',
    maxAge: 1000 * 60 * 60 * 24 * 365,
    signed: true,
    httpOnly: true
    };
    var hascome = 'hascome';
    var value = 'true';



    var client = redis.createClient();
    client.on("error", function (err) {
        console.log("statics Error " + err);
    });
    var count = 0;
    client.get('viewCount',function(err,reply){
        if(err){
            console.log('statics '+ err);
        }else if(reply && reply > 0){
            count = reply;
        }else{
            count = 0;
        }
    });
    function add(req,res,next){
        if(req.signedCookies[hascome] && req.signedCookies[hascome] === value) {

        }else{
            res.cookie(hascome,value,opts);
            count++;
            client.set('viewCount',count);
        }
        res.locals.viewCount = count;
        next();
    }
    return add;
}
module.exports = statics;
//module.exports = count;