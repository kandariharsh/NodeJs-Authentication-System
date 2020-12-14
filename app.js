const express = require('express');
const router = express.Router();
const app = express();
const mongoose = require('mongoose');
const expressEjsLayout = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
require('./config/passport')(passport)

mongoose.connect("mongodb://localhost:27017/authenticationDB",{useUnifiedTopology:true,useNewUrlParser:true});
var db=mongoose.connection;
db.once("open",()=>{ console.log("database connected")});
db.on("error",()=>{console.log("database is not connected")});


app.set('view engine','ejs');
app.use(expressEjsLayout);
//BodyParser
app.use(session({
    secret : 'secret',
    resave : true,
    saveUninitialized : true
   }));

 app.use(passport.initialize());
app.use(passport.session());

   //use flash
   app.use(flash());
   app.use((req,res,next)=> {
     res.locals.success_msg = req.flash('success_msg');
     res.locals.error_msg = req.flash('error_msg');
     res.locals.error  = req.flash('error');
   next();
   })
app.use(express.urlencoded({extended : false}));

//Routes
app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));

app.listen(3000,()=>{
    console.log("Server started");
}); 

