const express= require('express');
const router =  express.Router();
const {userAuthenticated} = require('../../helpers/authentication');
const Notification= require('../../models/Notification');

router.all('/*',userAuthenticated,(req, res, next)=>{
    req.app.locals.layout= "admin";
    next();
});

router.get('/mark-all-as-read',(req,res)=>{
    Notification.find({}).then(notifications=>{
        for(var i=0; i<notifications.length; i++){
            if(notifications[i].seen == 0){
                notifications[i].seen= 1;
                notifications[i].save();
            }
        }
        res.json({
            message: 'done '
        });
    }).catch(err=>{
        res.json({
            message: err
        });
    });
});

router.get('/:limit', (req, res)=>{
    Notification.find().limit(parseInt(req.params.limit)).sort({created_at: -1}).populate({
        path: 'user',
        populate: { path: 'user' }
      }).populate({
        path: 'post',
        populate: { path: 'post' }
      }).then(notifications=>{
            var new_noti = false;
            for(var i=0; i<notifications.length; i++){
                if(notifications[i].seen == 0){
                    new_noti = true;
                    break;
                }
            }
            res.json({
                notifications: notifications,
                new_noti : new_noti
            });
    });
});

router.get('/seen-notification/:post/:noti', (req, res)=>{
    console.log('sdfsdf');
    Notification.findOne({_id : req.params.noti}).then(notification=>{
        notification.seen = 1;
        notification.save();
        res.redirect('/blog/'+req.params.post);
    });
});

module.exports = router;