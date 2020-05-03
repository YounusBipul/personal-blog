const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const bcrypt = require('bcryptjs');;
const passport= require('passport');
const LocalStrategy = require('passport-local').Strategy;


router.all('/*', (req, res, next) => {
    req.app.locals.layout = "";
    next();
});

router.get('/', (req, res) => {
    res.redirect('/admin/auth/login');
});

router.get('/register', (req, res) => {
    User.findOne({ user_role: "admin" }).then(user=>{
        if(user!=null ){
            console.log('found');
            var message= "Multiple Admins are not allowed...";
            res.render('admin/register',{message: message});
        }
        else{
            console.log('not found');
            res.render('admin/register');
        }
    }).catch(err=>{
        console.log('not found');
        res.render('admin/register');
    });
    
});

router.post('/register', (req, res) => {
    let file = req.files.profile_pic;
    let file_name= Date.now()+"_"+file.name;
    file.mv('./public/profile_pic/'+file_name, (err)=>{
        console.log(err);
    })
    let newUser = new User({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        profile_pic: file_name,
        user_role: "admin",
    });

    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(req.body.password, salt, function(err, hash) {
            // Store hash in your password DB.
            newUser.password= hash;
            newUser.save().then(savedPost => {
                res.redirect('/admin/posts/');
            })
        });
    });

    
});

router.get('/login', (req, res) => {
    res.render('admin/login');
});

passport.use(new LocalStrategy({usernameField :'email'}, (email, password, done)=>{
    User.findOne({ email: email }, function(err, user) {
        if (err) { return done(err); }
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        
        bcrypt.compare(password, user.password, (err, matched)=>{
            if(err) return err;
            if(matched){
                return done(null, user);
            }
            else{
                return done(null, false, { message: 'Incorrect password.' });
            }
        });
      });
}));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});
  
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
});

router.post('/login', (req, res, next)=>{
    passport.authenticate('local', { 
        successRedirect: '/admin',
        failureRedirect: '/admin/auth/login',
        failureFlash: true 
    })(req,res,next);
});

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

module.exports = router;