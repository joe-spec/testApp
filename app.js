const express = require('express');
const path = require('path')
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const app = express();
const port = 3333;
// const cookie = require('js-cookie')

// cookie.set("qut", JSON.stringify(quiz))
// const data = cookie.getJSON("qut")

//password config
require('./config/passport')(passport);

//connect mongoose
mongoose.connect('mongodb://localhost/nhubtestapp',{
    useNewUrlParser: true,
    useUnifiedTopology: true 
}).then((res) => {
    console.log('connected to nHub testapp database')
}).catch((err) => {
    console.log(err)
});

//ejs
app.use(expressLayouts);
app.set('view engine', 'ejs');

// body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//method override for deleting
app.use(methodOverride((req,res)=>{
    if (req.body && typeof req.body === 'object' && '_method' in req.body){
        let method = req.body._method
        delete req.body._method
        return method
    } 
}))

//express session midleware
app.use(session({
    secret: '({[<>}])',
    saveUninitialized: false, //if saved to true tis session will be saved on the server on each request no matter if something change or not
    resave: false,
    cookie: { maxAge:Date.now() + 3600000}
}));

//initiallize passport
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash());

//global variable
app.use((req, res, next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user;
    // res.locals.isAuthenticated = 
    next();
})

//static file
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/admin', require('./routes/admin'));

app.listen(port, ()=>{console.log(`server listening on port ${port}`)});