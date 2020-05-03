module.exports= {
    userAuthenticated: function(req, res, next){
        if(req.isAuthenticated() && req.user.user_role=='admin'){
            next();
        }
        else{
            res.redirect('/admin/auth/');
        }
    }
}