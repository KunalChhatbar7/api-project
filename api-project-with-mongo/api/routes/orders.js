const e = require('express');
const { request } = require('express');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order  = require('../models/order');
const product = require('../models/product');
const Product = require('../models/product');

const checkAuth = require('../middleware/check-auth');

router.get('/',(req,res,next)=>{
    Order.find().select('product quantity _id').exec().then(docs =>{
        res.status(200).json({
            counts : docs.length,
            orders : docs.map(doc =>{
                return {
                    _id : doc._id,
                    product : doc.product,
                    quantity : doc.quantity,
                    request :{
                        type : 'GET',
                        url :'http://localhost:3000/orders/' + doc._id
                    }
                }
            })
           
        });
    }).catch(err=>{
        console.log(err);
        res.status(500).json({error :err});
    });
});

router.post('/', checkAuth,(req,res,next)=>{
    Product.findById(req.body.product)
        .then(
            product =>{
                if(!product){
                    return res.status(404).json({
                        message :"product not found"
                    });
                }
                const order =new Order(
                    {
                        _id : mongoose.Types.ObjectId(),
                        quantity : req.body.quantity,
                        product : req.body.product,   
                    }
                );
               return order
               .save();
            }).then(result => {
            console.log(result);
            res.status(201).json({
                message : 'order stored',
                createdOrder :{
                    _id : result._id,
                    product : result.product,
                    quantity : result.quantity
                },
                request : {
                    type : "Get",
                    url :'http://localhost:3000/orders/' + result._id
                    
                }
            });
        }).catch(err=>{
            console.log(err);
            res.status(500).json({error :err});
        });
    
});


//when dinamic id is there use : for make it dimanic
router.get('/:orderId',(req,res,next)=>{
  Order.findById(req.params.orderId).exec().then(order=>{
    if(!order){
        return res.status(404).json({
            message : "order Not Found"
        });
    }
    res.status(200).json({
        order : order,
        request : {
            type: 'GET',
            url :'http://localhost:3000/orders/'
        }
    })
  }).catch(err=>{
    console.log(err);
    res.status(500).json({error :err});
});
});

router.delete('/:orderId',(req,res,next)=>{
   Order.remove({_id:req.params.orderId})
   .exec()
   .then(result =>{
    res.status(200).json({
        message : "Order is deleted",
    });
    })
   .catch(err=>{
    console.log(err);
    res.status(500).json({error :err});
    });
});



module.exports = router;