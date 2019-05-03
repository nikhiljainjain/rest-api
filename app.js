const express = require("express");
const app =express();
const morgan = require('morgan');
const bodyparser =require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/product');
const orderRoutes = require('./api/routes/order');
mongoose.connect('mongodb://Aadish09:qwerty1234@ds151076.mlab.com:51076/rest-api',{useNewUrlParser: true});
app.use(morgan('dev'));
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