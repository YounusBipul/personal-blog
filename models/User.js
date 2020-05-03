const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    first_name: {
        required: true,
        type: String
    },
    last_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    user_role:{
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profile_pic:{
        type: String,
        required: true
    },
    created_at:{
        type: Date,
        default: Date.now()
    }
},
{
    toObject: {
        virtuals: true,
    },
    toJSON: {
        virtuals: true,
    }
});

module.exports = mongoose.model('users', userSchema);