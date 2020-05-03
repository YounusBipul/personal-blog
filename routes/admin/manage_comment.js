const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const {userAuthenticated} = require('../../helpers/authentication');


router.all('/*', userAuthenticated,  (req, res, next) => {
    req.app.locals.layout = "admin";
    next();
});

router.get('/', (req, res) => {
    Post.find({},{_id: 1, title: 1}).then(posts => {
        res.render('admin/comment/index', {
            posts: posts
        });
    }).catch(err => {
        console.log(err);
    });
});

router.post('/', (req, res) => {
    Post.find({},{_id: 1, title: 1}).then(posts => {
        Post.findOne({_id: req.body.selected_post}).populate({
            path: 'comments.user',
            populate: { path: 'comments.user' }
          }).then(post=>{
            res.render('admin/comment/index', {posts: posts, comments: post.comments, selected_post_id: req.body.selected_post});
        });
        
    }).catch(err => {
        console.log(err);
    });
});

router.delete('/delete/:id', (req, res)=>{
    Post.findOne({_id: req.body.post_id}).then( post=> {
        post.comments.id(req.params.id).remove();
        post.save().then(savedPost=>{
            //loading comment page with this post and comments
            Post.find({},{_id: 1, title: 1}).then(posts => {
                Post.findOne({_id: req.body.post_id}).populate({
                    path: 'comments.user',
                    populate: { path: 'comments.user' }
                  }).then(post=>{
                    res.render('admin/comment/index', {posts: posts, comments: post.comments, selected_post_id: req.body.selected_post});
                });
                
            }).catch(err => {
                console.log(err);
            });
        });
    });
});

module.exports = router;