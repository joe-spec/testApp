const User = require('../models/User')
module.exports = {
    ensureAuthenticated: function(req,res,next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash('error_msg', 'log in please');
        res.redirect('/users/login');
    },

    isAdmin: function(req,res,next){
        User.find({}, (err, user)=>{
            if (user.isAdmin !== false) {
                return next();
            }
            req.flash('error_msg', 'you are not an admin');
            res.redirect('/');
        })
    }
}