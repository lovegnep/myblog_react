/**
 * Created by Administrator on 2017/9/23.
 */
var mongoose  = require('mongoose');
var Schema    = mongoose.Schema;
var ObjectId  = Schema.ObjectId;




var TopicSchema = new Schema({
    title: { type: String },
    content: { type: String },
    reply_count: { type: Number, default: 0 },
    visit_count: { type: Number, default: 0 },
    create_at: { type: Date, default: Date.now },
    update_at: { type: Date, default: Date.now },
    last_reply: { type: ObjectId },
    last_reply_at: { type: Date, default: Date.now },
    tab: {type: String},
    secret:{type:Boolean,default:false},
    deleted: {type: Boolean, default: false},
});
TopicSchema.index({create_at: -1});
mongoose.model('Theme', TopicSchema);
