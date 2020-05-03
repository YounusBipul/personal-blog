const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const helper= require('../../helpers/object-helpers');
const {userAuthenticated} = require('../../helpers/authentication');


router.all('/*', userAuthenticated,  (req, res, next) => {
    req.app.locals.layout = "admin";
    next();
});

router.get('/', (req, res) => {
    var page =  req.query.page || 1;
    var perPage = 10;
    Post.find({}).skip((page-1)*perPage).limit(perPage).then(posts => {
        Post.find({}).then(totalPosts=>{
            res.render('admin/post/index', {
                posts: posts,
                pages: Math.ceil(totalPosts.length/perPage),
                current: page,
                url: '/admin/posts?',
                title: 'All Posts'
            });
        });
        
    }).catch(err => {
        console.log(err);
    });
});

router.get('/create', (req, res) => {
    res.render('admin/post/create');
});

router.post('/create', (req, res) => {
    let file = req.files.cover_image;
    let file_name= Date.now()+"_"+file.name;
    file.mv('./public/uploads/'+file_name, (err)=>{
        console.log(err);
    })

    let newPost = new Post({
        title: req.body.title,
        body: req.body.body,
        cover_image: file_name
    });
    newPost.save().then(savedPost => {
        // console.log(savedPost);
        res.redirect('/admin/posts/');
    })
});

router.get('/edit/:id', (req, res)=>{
    Post.findOne({_id: req.params.id}).then(post=>{
        res.render('admin/post/edit',{post:post});
    });
});

router.put('/edit/:id', (req, res)=>{
    Post.findOne({_id: req.params.id}).then(post=>{
        
        post.title= req.body.title;
        post.body= req.body.body;
        if(req.files != null){
            let file = req.files.cover_image;
            let file_name= Date.now()+"_"+file.name;
            file.mv('./public/uploads/'+file_name, (err)=>{
                console.log(err);
            })
            post.cover_image= file_name;
        }

        post.save().then(updatedPost=>{
            res.redirect('/admin/posts');
        });
    });
});

router.delete('/delete/:id', (req, res)=>{
    Post.deleteOne({_id: req.params.id}).then(post=>{
        res.redirect('/admin/posts/');
    }).catch(err=>{
        console.log(err);
    });
});

module.exports = router;