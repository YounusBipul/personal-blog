const express = require('express');
const router = express.Router();
const Category = require('../../models/Category');
const helper= require('../../helpers/object-helpers');
const {userAuthenticated} = require('../../helpers/authentication');


router.all('/*', userAuthenticated,  (req, res, next) => {
    req.app.locals.layout = "admin";
    next();
});

router.get('/', (req, res) => {
    var page =  req.query.page || 1;
    var perPage = 10;
    Category.find({}).skip((page-1)*perPage).limit(perPage).then(posts => {
        Category.find({}).then(totalCategorys=>{
            res.render('admin/category/index', {
                categorys: totalCategorys,
                pages: Math.ceil(totalCategorys.length/perPage),
                current: page,
                url: '/admin/categorys?',
                title: 'All Categorys'
            });
        });
        
    }).catch(err => {
        console.log(err);
    });
});

router.get('/create', (req, res) => {
    res.render('admin/category/create');
});

router.post('/create', (req, res) => {
   

    let newCategory = new Category({
        name: req.body.name,
    });
    newCategory.save().then(savedCategory => {
        // console.log(savedCategory);
        res.redirect('/admin/categorys/');
    })
});

router.get('/edit/:id', (req, res)=>{
    Category.findOne({_id: req.params.id}).then(category=>{
        res.render('admin/category/edit',{category:category});
    });
});

router.put('/edit/:id', (req, res)=>{
    Category.findOne({_id: req.params.id}).then(category=>{
        
        category.name= req.body.name;
        category.save().then(updatedCategory=>{
            res.redirect('/admin/categorys');
        });
    });
});

router.delete('/delete/:id', (req, res)=>{
    Category.deleteOne({_id: req.params.id}).then(category=>{
        res.redirect('/admin/categorys/');
    }).catch(err=>{
        console.log(err);
    });
});

module.exports = router;