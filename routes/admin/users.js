const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const {userAuthenticated} = require('../../helpers/authentication');
var bcrypt = require('bcryptjs');


router.all('/*', userAuthenticated,  (req, res, next) => {
    req.app.locals.layout = "admin";
    next();
});

router.get('/', (req, res) => {
    User.find({user_role : 'user'}).then(users => {
        res.render('admin/user/index', {
            users: users,
            count: users.length
        });
    }).catch(err => {
        console.log(err);
    });
});

router.delete('/:id', (req, res) => {
    User.findOne({
        _id: req.params.id
    }).then(user => {
        user.delete().then(savedUser => {
            res.redirect('/admin/user');
        });
    });
});

router.post('/reset-password', (req, res) => {
    console.log(req.body);
    User.findOne({
        _id: req.body.user_id
    }).then(user => {
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(req.body.new_password, salt, function(err, hash) {
                // Store hash in your password DB.
                user.password= hash;
                user.save().then(savedPost => {
                    res.redirect('/admin/user');
                })
            });
        });
    });
});

module.exports = router;