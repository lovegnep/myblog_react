/**
 * Created by Administrator on 2017/9/23.
 */
var mongoose  = require('mongoose');
var Schema    = mongoose.Schema;
var ObjectId  = Schema.ObjectId;

var ReplySchema = new Schema({
    content: { type: String },
    theme_id: { type: ObjectId},
    create_at: { type: Date, default: Date.now },
    ups: {type:Number,default:0},
    reply_id:{type:ObjectId},
    lou:{type:String,default:''},
    deleted: {type: Boolean, default: false},
});
ReplySchema.index({theme_id: 1});
ReplySchema.index({ create_at: -1});

mongoose.model('Reply', ReplySchema);