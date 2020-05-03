const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const Schema = mongoose.Schema;
var dateFormat = require('dateformat');
mongoose.plugin(slug);

var comments = new Schema ({
    user : {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    comment_body : {
        type: String,
        required: true
    },
    created_at : {
        type: Date,
        default: Date.now()
    }
});

const postSchema = new Schema({
    title: {
        required: true,
        type: String
    },
    slug:{
        type: String,
        slug: "title"
    },
    body: {
        type: String,
        required: true,
    },
    cover_image: {
        type: String,
        required: true
    },
    comments: {
        type: [comments],
        default: null
    },
    view:{
        type: Number,
        default: 0
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

// mongoose.plugin(urlslugs('title', {field: 'slug'}));
postSchema.index({titile: 'text'});

module.exports = mongoose.model('posts', postSchema);