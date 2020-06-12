const express = require('express');
const router = express.Router();
const User = require('../../models/User');
var bcrypt = require('bcryptjs');
const passport= require('passport');
const LocalStrategy = require('passport-local').Strategy;


router.all('/*', (req, res, next) => {
    req.app.locals.layout = "";
    next();
});

router.get('/', (req, res) => {
    res.redirect('/blog/auth/register');
});

router.get('/register', (req, res) => {
    res.render('blog/register');
});

router.post('/register', (req, res) => {
    User.findOne({email : req.body.email, user_role: 'user'}).then( user=>{
        console.log(user);
        if(user){
            console.log('if');
            req.flash('error', 'User already exists...');
            res.redirect('/blog/auth/register');
        }
        else{
            console.log('else');
            // let file = req.files.profile_pic;
            // let file_name= Date.now()+"_"+file.name;
            // file.mv('./public/profile_pic/'+file_name, (err)=>{
            //     console.log(err);
            // })
            let newUser = new User({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email,
                profile_pic: req.body.profile_picture,
                user_role: "user",
            });

            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(req.body.password, salt, function(err, hash) {
                    // Store hash in your password DB.
                    newUser.password= hash;
                    newUser.save().then(savedPost => {
                        req.flash('success','Your Account has been registered. Please login...');
                        res.redirect('/blog/auth/login');
                    })
                });
            });
        }
    }); 
});

router.get('/login', (req, res) => {
    res.render('blog/login'); 
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
        successRedirect: '/',
        failureRedirect: '/blog/auth/login',
        failureFlash: true 
    })(req,res,next);
});

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

module.exports = router;