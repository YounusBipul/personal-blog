const express= require('express');
const router =  express.Router();
const User= require('../../models/User');
const Category= require('../../models/Category');
const Notification= require('../../models/Notification');

router.all('/*', (req, res, next)=>{
    req.app.locals.layout= "blog";
    next();
});

router.get('/', (req, res)=>{
    res.redirect('/blog');
});

router.get('/about', (req,res)=>{
    User.findOne({user_role : 'admin'}).then(user=>{
        Category.find({}).then(categorys=>{
            res.render('blog/about',{
                admin:user,
                title: 'About',
                categorys: categorys
            });
        });
    });
});


router.get('/test', (req,res)=>{
    Notification.findOne().then(noti=>{
        noti.test_filed= "this shit works";
        res.json({
           data: noti,
           title: 'All Posts'
        });
    });
});

module.exports = router;