/**
 * Created by Administrator on 2017/9/23.
 */
var mongoose  = require('mongoose');
var config   = require('../config');
mongoose.connect(config.db, {
    server: {poolSize: 20}
}, function (err) {
    if (err) {
        console.log('connect to %s error: ', config.db, err.message);
        process.exit(1);
    }
});
require('./theme');
require('./reply');
exports.Theme        = mongoose.model('Theme');
exports.Reply        = mongoose.model('Reply');