const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const {userAuthenticated} = require('../../helpers/authentication');


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

module.exports = router;