/**
 * 生成验证码
 */

var MdCode = module.exports;
var Canvas = require('canvas');


function randomNum(min,max){
    return Math.floor(Math.random()*(max-min)+min);
}

function randomColor(min,max){
    var _r = randomNum(min,max);
    var _g = randomNum(min,max);
    var _b = randomNum(min,max);
    return "rgb("+_r+","+_g+","+_b+")";
}

var getRandom = function(start,end){
    return start + Math.random() * (end - start);
};

MdCode.create = function() {
    var width = 120;
    var height = 35;
    var canvas = new Canvas(width, height);
    var ctx = canvas.getContext('2d');
    // ctx.textBaseline = 'bottom';
    //** 绘制背景色 **//
    //颜色若太深可能导致看不清
    ctx.fillStyle = randomColor(180,250);
    ctx.fillRect(0, 0, width, height);
    var code = "";

    //** 绘制文字 **//
    var start = 10;
    var font = 'bold 20px arial';
    var trans = {c:[-0.108, 0.108],b:[-0.05, 0.05]};
    var str = 'abcdefghijklmnpqrstuvwxyz123456789';
    for(var i = 0; i < 4; i++) {
        var txt = str[randomNum(0, str.length)];
        code += txt;
        ctx.font = font;
        ctx.fillStyle = randomColor(50, 160);
        ctx.fillText(txt, start, 23, 10);
        ctx.fillRect();
        var c = getRandom(trans['c'][0],trans['c'][1]);
        var b = getRandom(trans['b'][0],trans['b'][1]);
        ctx.transform(1,b, c, 1, 0, 0);
        start += 28;

    }

    //*** 绘制干扰线 ***//
    for(var i = 0; i < 4; i++) {
        ctx.strokeStyle = randomColor(40, 180);
        ctx.beginPath();
        ctx.moveTo( randomNum(0,width), randomNum(0,height) );
        ctx.lineTo( randomNum(0,width), randomNum(0,height) );
        ctx.stroke();
    }
    // ** 绘制干扰点 ** //
    for (var i = 0; i < 50; i++) {
        ctx.fillStyle = randomColor(0,255);
        ctx.beginPath();
        ctx.arc(randomNum(0,width),randomNum(0,height), 1, 0, 2*Math.PI);
        ctx.fill();
    }


    var buf = canvas.toDataURL();
    var result = {};
    result.statusCode = 0;
    // buf为主要显示图像的数据
    result.data = buf;
    result.code = code;

    // 返还客户端
    return (result);

}