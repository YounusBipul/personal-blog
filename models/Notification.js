const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    post: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'posts'
    },
    user: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    seen:{
        type: Number,
        default: 0
    },
    created_at:{
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('notifications', notificationSchema);