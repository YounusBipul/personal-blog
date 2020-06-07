const express= require('express');
const router =  express.Router();
const Post= require('../../models/Post');
const Category= require('../../models/Category');

router.get('/:slug',(req,res)=>{
    var page =  req.query.page || 1;
    var perPage = 10;

    Category.findOne({slug: req.params.slug}).then(target_category=>{
        Post.find({category: target_category._id}).skip((page-1)*perPage).limit(perPage).sort({created_at: -1})
        .populate({
            path: 'category',
            Model: Category
        }).then(posts=>{
            Category.find({}).then(categorys=>{
                Post.find({is_featured: true}).then(featuredPosts=>{
                    Post.find({category: target_category._id}).then(totalPosts=>{
                        res.render('blog/index',{
                            posts:posts,
                            featuredPosts: featuredPosts,
                            categorys: categorys,
                            pages: Math.ceil(totalPosts.length/perPage),
                            current: page,
                            url: '/category/'+req.params.slug+"?",
                            title: target_category.name
                        });
                    });
                });
                
            })
        });
    });
});

module.exports = router;