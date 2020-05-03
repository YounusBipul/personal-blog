const express= require('express');
const router =  express.Router();
const post= require('../../models/Post');
// const User= require('../../models/User');
const Notification= require('../../models/Notification');

router.all('/*', (req, res, next)=>{
    req.app.locals.layout= "blog";
    next();
});

router.get('/', (req, res)=>{
    var page =  req.query.page || 1;
    var perPage = 10;
    if(req.query.search != undefined){ //need to fix this part
        // console.log(req.query.search);
        post.find({ $text: { $search: req.query.search }}).skip((page-1)*perPage).limit(perPage).sort({created_at: -1}).then(posts=>{
            post.find({ $text: { $search: req.query.search }}).then(totalPosts=>{
                res.render('blog/index',{
                    posts:posts,
                    pages: Math.ceil(totalPosts.length/perPage),
                    current: page,
                    url: '/blog?search='+req.query.search+'&',
                    title: 'All Posts'
                });
            });
        });
    }
    else{
        console.log('else');
        post.find({}).sort({created_at: -1}).skip((page-1)*perPage).limit(perPage).then(posts=>{
            post.find({}).then(totalPosts=>{
                res.render('blog/index',{
                    posts:posts,
                    pages: Math.ceil(totalPosts.length/perPage),
                    current: page,
                    url: '/blog?',
                    title: 'All Posts'
                });
            });
        });
    }
});

router.get('/:slug', (req, res)=>{
    post.findOne({slug: req.params.slug}).populate({
        path: 'comments.user',
        populate: { path: 'comments.user' }
      }).then(post=>{
          if(req.user && req.user.user_role!='admin'){
            post.view+=1;
            post.save();
          }
          res.render('blog/single-blog',{
              post:post,
              title: post.title
            });
    });
});

router.post('/:id/add-comment', (req, res)=>{
    if(req.user){
        post.findOne({_id: req.params.id}).then(post=>{
            post.comments.push({
                user: req.user._id,
                comment_body: req.body.comment_body
            });
            post.save().then(savedpost=>{
                let newNotfication = new Notification({
                    user : req.user._id,
                    post : req.params.id
                });
                newNotfication.save();
                res.redirect('/blog/'+post.slug);
            });
            
        });
    }
    else{
        console.log('Not logged in');
    }
});

router.post('/:id/update-comment', (req, res)=>{
    post.findOne({_id: req.params.id}).then(post=>{
        let comments= post.comments;
        for(var i=0; i<comments.length; i++){
            if(comments[i]._id == req.body.comment_id){
                break;
            }
        }
        post.comments[i].comment_body= req.body.upate_commnet_body;
        post.save();
        res.redirect('/blog/'+post.slug);
    });
});

router.post('/:id/delete-comment', (req, res)=>{
    if(req.user){
        post.findOne({_id: req.params.id}).then(post=>{
            post.comments.id(req.body.comment_id_to_delete).remove();
            post.save().then(savedpost=>{
                res.redirect('/blog/'+post.slug);
            });
            
        });
    }
    else{
        console.log('Not logged in');
    }
});

module.exports = router;