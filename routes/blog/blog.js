const express= require('express');
const router =  express.Router();
const Post= require('../../models/Post');
const Category= require('../../models/Category');
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
        Post.find({ $text: { $search: req.query.search }}).skip((page-1)*perPage).limit(perPage).sort({created_at: -1}).
        populate({
            path: 'category',
            Model: Category 
        }).
        then(posts=>{
            // console.log(posts[0].category);
            Post.find({ $text: { $search: req.query.search }}).then(totalPosts=>{
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
        Post.find({}).sort({created_at: -1}).skip((page-1)*perPage).limit(perPage).
        populate({
            path: 'category',
            Model: Category 
        }).then(posts=>{
            // console.log(posts[0].category);
            Post.find({}).then(totalPosts=>{
                Post.find({is_featured : true}).then(featuredPosts=>{
                    Category.find({}).then(categorys=>{
                        res.render('blog/index',{
                            posts:posts,
                            featuredPosts: featuredPosts,
                            categorys: categorys,
                            pages: Math.ceil(totalPosts.length/perPage),
                            current: page,
                            url: '/blog?',
                            title: 'All Posts'
                        });
                    });
                });
                
            });
        });
    }
});

router.get('/:slug', (req, res)=>{
    Post.findOne({slug: req.params.slug}).populate({
        path: 'comments.user',
        populate: { path: 'comments.user' }
      }).populate({
          path: 'category',
          Model: Category
      }).then(post=>{
          if(req.user && req.user.user_role=='admin'){
            //do nothing
          }
          else{
            post.views+=1;
            post.save();
          }

          Category.find({}).then(categorys=>{
              Post.find({category : post.category, _id: { $nin: [post._id] } }).limit(6).then(relatedPosts=>{
                var hasRelatedPost= true;
                if(relatedPosts.length == 0){
                    hasRelatedPost= false;
                }
                res.render('blog/single-blog',{
                    post:post,
                    title: post.title,
                    categorys: categorys,
                    relatedPosts: relatedPosts,
                    hasRelatedPost: hasRelatedPost
                  });
              });
            
          });
         
    });
});

router.post('/:id/add-comment', (req, res)=>{
    if(req.user){
        Post.findOne({_id: req.params.id}).then(post=>{
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
    Post.findOne({_id: req.params.id}).then(post=>{
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
        Post.findOne({_id: req.params.id}).then(post=>{
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

router.post('like/:id', (req, res)=>{
    console.log('hit');
    if(req.user){
       //do stuff
       console.log(req.user);
    }
    else{
        console.log('Not logged in');
    }
    return 1;
});


module.exports = router;