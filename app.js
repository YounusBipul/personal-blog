const express= require('express');
const exphbs = require('express-handlebars');
const app =  express();
const path= require('path');
const mongoose = require('mongoose');
const bodyParser= require('body-parser');
const override= require('method-override');
const upload = require('express-fileupload');
const passport= require('passport');
const session = require("express-session");
const flash = require('connect-flash');

//connecting to databse
mongoose.Promise= global.Promise;
mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb://localhost/blog',  { useNewUrlParser: true, useUnifiedTopology: true}).then(db=>{
    console.log("Databse connected");
}).catch(error=> {
    console.log("Couldn't connect to database. "+error);
})

//setting public directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(upload());

//method override
app.use(override('_method'));

//setting body parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//setting tview engine
const handlebarConfig =  exphbs.create({
    defaultLayout: 'home',
    helpers :{
        doMath : function(operand_1, operator, operand_2, options){
            var operators = {
                'eq': function(l,r) { return l == r; },
                'noteq': function(l,r) { return l != r; },
                'gt': function(l,r) { return Number(l) > Number(r); },
                'or': function(l,r) { return l || r; },
                'and': function(l,r) { return l && r; },
                '%': function(l,r) { return (l % r) === 0; }
               }
               , result = operators[operator](operand_1,operand_2);
             
               if (result){
                //    console.log( 'true'+ options.fn(this));
                   return options.fn(this);
               }
               else{
                // console.log( 'false'+options.inverse(this));
                return options.inverse(this);
               }  
        },
        matchId : function(operand_1, operator, operand_2, options ){
            var operators = {
                '==': function(l,r) { return l.equals(r); },
               }
               , result = operators[operator](operand_1,operand_2);
             
               if (result){
                   return options.fn(this);
               }
               else{
                return options.inverse(this);
               }  
        },
        paginate: function(options){
            let output = '';
            let url= options.hash.url;
            // console.log(options.hash);
            if(options.hash.current === 1){
                output += `<li class="page-item disabled"><a class="page-link">First</a></li>`;
            } else {
                output += `<li class="page-item"><a href="${url}page=1" class="page-link">First</a></li>`;
            }
    
            let i = (Number(options.hash.current) > 5 ? Number(options.hash.current) - 4 : 1);
    
            if(i !== 1){
                output += `<li class="page-item disabled"><a class="page-link">...</a></li>`;
            }
            for(; i <= (Number(options.hash.current) + 4) && i <= options.hash.pages; i++){
                if(i === parseInt(options.hash.current)){
                    output += `<li class="page-item active"><a class="page-link">${i}</a></li>`;
                } else {
                    output += `<li class="page-item "><a href="${url}page=${i}" class="page-link">${i}</a></li>`;
                }
                if(i === Number(options.hash.current) + 4 && i < options.hash.pages){
                    output += `<li class="page-item disabled"><a class="page-link">...</a></li>`;
                }
            }
        
            if(options.hash.current === options.hash.pages) {
                output += `<li class="page-item disabled"><a class="page-link">Last</a></li>`;
            } else {
                output += `<li class="page-item "><a href="${url}page=${options.hash.pages}" class="page-link">Last</a></li>`;
            }
            return output;
        }
    }
});
app.engine('handlebars', handlebarConfig.engine);
app.set('view engine', 'handlebars');


// session and flash setup
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}))
app.use(flash());

//passport setup
app.use(passport.initialize());
app.use(passport.session());

//local variables
app.use((req,res,next)=>{
    res.locals.loggedInUser = req.user || null;
    res.locals.error = req.flash('error') || null;
    next();
});


//load routes
const admin_routes = require('./routes/admin/index');
const admin_auth = require('./routes/admin/admin_authentication');
const admin_post_routes = require('./routes/admin/post');
const admin_manage_comment = require('./routes/admin/manage_comment');
const admin_users = require('./routes/admin/users');
const admin_notification = require('./routes/admin/notification');
const blog_routes = require('./routes/blog/index');
const blog = require('./routes/blog/blog');
const blog_auth = require('./routes/blog/blog_authentication');
const blog_profile = require('./routes/blog/profile');

//use routes
app.use('/', blog_routes);
app.use('/blog', blog);
app.use('/profile', blog_profile);
app.use('/blog/auth',blog_auth);
app.use('/admin', admin_routes);
app.use('/admin/auth', admin_auth);
app.use('/admin/posts/', admin_post_routes);
app.use('/admin/comment/', admin_manage_comment);
app.use('/admin/user/', admin_users);
app.use('/admin/notification', admin_notification);

app.get('/*', (req, res)=>{
    res.render('blog/warning', {message: '404 - Page Not Found !!!'});
});

//start listening
app.listen(4500, ()=>{
    console.log('listening on port 4500');
})