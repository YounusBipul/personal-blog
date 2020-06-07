const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);

const categorySchema = new Schema({
    name: {
        required: true,
        type: String
    },
    slug:{
        type: String,
        slug: "name"
    },
    created_at:{
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('categories', categorySchema);