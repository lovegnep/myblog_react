
var path = require('path');

var config = {
    la:'uuuuuuuuuu',
    lb:'kkkkkkkkkkkkk',
    name: 'blog', 


    author:'好想吃肉',
    // mongodb 配置
    db: 'mongodb://127.0.0.1/myblog',

    session_secret: 'hehehaha', // 
    auth_cookie_name: 'gnep',
    auth_cookie_val:'peng',

    // 程序运行的端口
    port: 3000,
    upload: {
        path: path.join(__dirname, 'public/upload/'),
        url: '/upload/'
    },
    file_limit: '10MB',
    // 话题列表显示的话题数量
    list_topic_count: 10,
    site_static_host: '', // 静态文件存储域名


    // 版块
    tabs: [
        ['dailylift', '生活'],
        ['frontend', '前端'],
        ['language', '编程语言'],
        ['algorithm','算法'],
        ['embeded','嵌入式']
    ],

    create_reply_per_day: 1000, // 每个用户一天可以发的评论数
    visit_per_day: 1000, // 每个 ip 每天能访问的次数
};

module.exports = config;
