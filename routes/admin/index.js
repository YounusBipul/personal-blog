const express= require('express');
const router =  express.Router();
const {userAuthenticated} = require('../../helpers/authentication');
const User= require('../../models/User');
const Post = require('../../models/Post');
const Category = require('../../models/Category');

router.all('/*',(req, res, next)=>{
    req.app.locals.layout= "admin";
    next();
});

// router.use((req,res,next)=>{
//     Notification.find({}).populate({
//         path: 'user',
//         populate: { path: 'user' }
//       }).populate({
//         path: 'post',
//         populate: { path: 'post' }
//       }).then(notis=>{
//         res.locals.notifications = notis;
//         next();
//     }); 
// });

router.get('/',userAuthenticated, (req, res)=>{
    Post.find({}).then(posts=>{
        Category.find({}).then(categorys=>{
            User.find({user_role : 'user'}).then(users=>{
                var context = {
                    'totalPosts' : posts.length,
                    'totalCategorys' : categorys.length,
                    'totalUsers' : users.length
                };
                res.render('admin/index', context); 
            })
        });
    });
    
});

module.exports = router;