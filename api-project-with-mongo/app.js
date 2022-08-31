const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const orderRoutes  = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');



const db_url =  require("./properties").DB_URL;
mongoose.connect(db_url);

mongoose.Promise = global.Promise;
mongoose.connection.on("Conntexted",()=>{
    console.log("Connected to MongoDB");
});



app.use(morgan('dev'));
//true allow you parse extanded body
app.use(bodyParser.urlencoded({
    extended : false
}));
app.use(bodyParser.json());

app.use((req,res,next)=>{
 res.header(
    'Access-Control-Allow-Origin','*',
 );
 res.header('Access-Control-Allow-Headers' , 'Origin,X-Request-With,Content-Type,Accept,Authorization')
if(req.method ==='OPTIONS'){
    req.header('Access-Control-Allow-Methods','PUT , POST, PATCH, DELETE, GET');
    return res.status(200).json({});
}
next();
});
//router is middalware 
//all routes
app.use('/products',productRoutes);
app.use('/orders',orderRoutes);
app.use('/user',userRoutes);

app.use((req,res,next)=>{
    const error = new Error('Not Found');
    error.status = 400 ;
    next(error);
})

app.use((error,req,res,next)=>{
    res.status(error.status || 500);
    res.json({
        error : {
            message :  error.message
        }
    });
})

module.exports = app;