const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const Category = require('../../models/Category');
const helper= require('../../helpers/object-helpers');
const {userAuthenticated} = require('../../helpers/authentication');


router.all('/*', userAuthenticated,  (req, res, next) => {
    req.app.locals.layout = "admin";
    next();
});

router.get('/', (req, res) => {
    var page =  req.query.page || 1;
    var perPage = 10;
    Post.find({}).skip((page-1)*perPage).limit(perPage).populate({
        path: 'category',
        model: Category
    }).then(posts => {
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
    Category.find({}).then(allCategories=>{
        res.render('admin/post/create', {categorys: allCategories});
    });
    
});

router.post('/create', (req, res) => {
    // let file = req.files.cover_image;
    // let file_name= Date.now()+"_"+file.name;
    // file.mv('./public/uploads/'+file_name, (err)=>{
    //     console.log(err);
    // })
    var featured;
    if(req.body.featured){
        featured= true;
    }
    else{
        featured= false;
    }
    let newPost = new Post({
        title: req.body.title,
        body: req.body.body,
        cover_image: req.body.cover_image_pic,
        category : req.body.category,
        is_featured : featured
    });
    newPost.save().then(savedPost => {
        // console.log(savedPost);
        res.redirect('/admin/posts/');
    })
});

router.get('/edit/:id', (req, res)=>{
    Post.findOne({_id: req.params.id}).then(post=>{
        Category.find({}).then(allCategories=>{
            res.render('admin/post/edit',{post:post, categorys: allCategories});
        });
    });
});

router.put('/edit/:id', (req, res)=>{
    Post.findOne({_id: req.params.id}).then(post=>{
        
        post.title= req.body.title;
        post.body= req.body.body;
        post.category= req.body.category;
        post.cover_image = req.body.cover_image_pic;
        if(req.body.featured){
            post.is_featured= true;
        }
        else{
            post.is_featured= false;
        }
        // if(req.files != null){
        //     let file = req.files.cover_image;
        //     let file_name= Date.now()+"_"+file.name;
        //     file.mv('./public/uploads/'+file_name, (err)=>{
        //         console.log(err);
        //     })
        //     post.cover_image= file_name;
        // }

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

router.get('/featured', (req,res)=>{
    var page =  req.query.page || 1;
    var perPage = 10;
    Post.find({is_featured : true}).skip((page-1)*perPage).limit(perPage).populate({
        path: 'category',
        model: Category
    }).then(posts => {
        Post.find({}).then(totalPosts=>{
            res.render('admin/post/index', {
                posts: posts,
                pages: Math.ceil(totalPosts.length/perPage),
                current: page,
                url: '/admin/posts/featured?',
                title: 'Featured Posts'
            });
        });
        
    }).catch(err => {
        console.log(err);
    });
});

module.exports = router;