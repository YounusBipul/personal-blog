const express= require('express');
const router =  express.Router();
const {userAuthenticated} = require('../../helpers/authentication');
const Notification= require('../../models/Notification');

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
    res.render('admin/index');
});

module.exports = router;