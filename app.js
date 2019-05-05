const express = require("express");
const app =express();
const morgan = require('morgan');//gives log
const bodyparser =require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/product');
const orderRoutes = require('./api/routes/order');
const userRoutes = require('./api/routes/user');
mongoose.connect('mongodb://Aadish09:'+process.env.pw+'@ds151076.mlab.com:51076/rest-api',{useNewUrlParser: true});

mongoose.Promise=global.Promise;
app.use(morgan('dev'));
app.use('/uploads',express.static('uploads'));
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

//allowing CORS
app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','Origin,X-Requested-With,Content-Type,Accept, Authorization'  );
if(req.method === 'OPTIONS'){
    res.header('Access-Control-Allow-Methods','PUT, PATCH, DELETE, POST,GET');
    return res.status(200).json({});
}
next();
});

app.use('/products',productRoutes);
app.use('/orders',orderRoutes);
app.use('/users',userRoutes);
// req other than above rotes should get error
app.use((req,res,next) => {
    const error = new Error('Not found');
    error.status=404;
    next(error);
});

app.use((error,req,res,next)=>{
    res.status(error.status || 500);
    res.json({
        error:{
            message:error.message
        }
    });
});
module.exports = app;