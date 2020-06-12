const express= require('express');
const router =  express.Router();
const User= require('../../models/User');
const Category= require('../../models/Category');
var bcrypt = require('bcryptjs');

router.all('/*', (req, res, next)=>{
    req.app.locals.layout= "blog";
    next();
});

router.get('/:id', (req, res)=>{
    if(req.user){
        if(req.user._id.equals(req.params.id)){
            User.findOne({_id: req.params.id}).then(user=>{
                Category.find({}).then(categorys=>{
                    res.render('blog/profile',{
                        user: user,
                        title: 'profile '+ user.first_name,
                        categorys: categorys
                    });
                });
            });
        }
        else{
            res.send('You are not allowed to see this info...');
        }
    }
    else{
        res.send('You are not allowed to see this info...');
    }
});

router.get('/edit/:id', (req, res)=>{
    if(req.user){
        if(req.user._id.equals(req.params.id)){
            User.findOne({_id: req.params.id}).then(user=>{
                Category.find({}).then(categorys=>{
                    res.render('blog/edit-profile',{
                        user: user,
                        title: 'Edit profile '+ user.first_name,
                        categorys: categorys
                    });
                });
            });
        }
        else{
            res.send('You are not allowed to see this info...');
        }
    }
    else{
        res.send('You are not allowed to see this info...');
    }
});

router.post('/edit/:id', (req, res)=>{
    if(req.user){
        if(req.user._id.equals(req.params.id)){
            User.findOne({_id: req.params.id}).then(user=>{

                user.first_name= req.body.first_name;
                user.last_name= req.body.last_name;
                user.email = req.body.email;
                user.profile_pic = req.body.profile_picture
                // if(req.files != null){
                //     let file = req.files.profile_pic;
                //     let file_name= Date.now()+"_"+file.name;
                //     file.mv('./public/profile_pic/'+file_name, (err)=>{
                //         console.log(err);
                //     })
                //     user.profile_pic= file_name;
                // }

                user.save().then(updatedPost=>{
                    res.redirect('/profile/'+user._id);
                });
                
            });
        }
        else{
            res.render('blog/warning', {message: 'You are not allowed to see this info...'});
        }
    }
    else{
        res.render('blog/warning', {message: 'You are not allowed to see this info...'});
    }
});

router.get('/change-password/:id', (req, res)=>{
    if(req.user){
        if(req.user._id.equals(req.params.id)){
            Category.find({}).then(categorys=>{
                res.render('blog/change-password',{
                    user: req.user,
                    title: 'Change Password',
                    categorys: categorys
                });
            });
        }
        else{
            res.render('blog/warning', {message: 'You are not allowed to see this info...'});
        }
    }
    else{
        res.render('blog/warning', {message: 'You are not allowed to see this info...'});
    }
});

router.post('/change-password/:id', (req, res)=>{
    if(req.user){
        if(req.user._id.equals(req.params.id)){
            User.findOne({_id: req.params.id}).then(user=>{
                bcrypt.compare(req.body.current_password, user.password, (err, matched)=>{
                    if(err) return err;
                    if(matched){
                        bcrypt.genSalt(10, function(err, salt) {
                            bcrypt.hash(req.body.new_password, salt, function(err, hash) {
                                // Store hash in your password DB.
                                user.password= hash;
                                user.save().then(savedPost => {
                                    res.redirect('/profile/change-password/'+user._id);
                                })
                            });
                        });
                    }
                    else{
                        console.log('mara');
                        req.flash('error','Current password mismatch');
                        res.redirect('/profile/change-password/'+user._id);
                    }
                });
            });
        }
        else{
            res.render('blog/warning', {message: 'You are not allowed to see this info...'});
        }
    }
    else{
        res.render('blog/warning', {message: 'You are not allowed to see this info...'});
    }
});


module.exports = router;