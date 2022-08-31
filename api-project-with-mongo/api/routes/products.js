const e = require('express');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const product = require('../models/product');

const checkAuth = require("../middleware/check-auth");

const Products  = require('../models/product');

router.get('/',(req,res,next)=>{
    Products.find()
    .select('name price _id')
    .exec()
    .then(docs => {
        console.log(docs);
        const response ={
            count : docs.length,
            product : docs.map(doc =>{
                return {
                    name :doc.name,
                    price : doc.price,
                    _id : doc._id,
                    request: {
                        type : 'GET',
                        url :"http://localhost:3000/products/" + doc._id
                    }
                }
            }),
        }
        //if(docs.length >=0){
            res.status(200).json(response);
        // }else{
        //     res.status(404).json({
        //         message:"No data found in database"
        //     });
        // }
    }).catch(err => {
        console.log(err);
        res.status(500).json({error:err})
    })
});
//witch data need that define in documentation 

router.post('/', checkAuth,(req,res,next)=>{
   const product  = new Products({
    _id :new mongoose.Types.ObjectId(),
    name: req.body.name,
    price:req.body.price
   });
   product.save().then(result => {
    console.log(result);
    res.status(201).json({
        message : "Created Products successfully",
        createProduct : {
            name : result.name,
            price : result.price,
            _id : result._id,
            request: {
                type : 'GET',
                url :"http://localhost:3000/products/" + result._id
            }
        }
    });
   }).catch(err =>{
     console.log(err);
     res.status(500).json({
        error : err
     });
    });
});


router.get('/:productId',(req,res,next)=>{
    const id  = req.params.productId;
   Products.findById(id)
   .select('name price _id')
   .exec()
   .then(
    doc => {
        console.log(doc);
        if(doc){
        res.status(200).json({
                product :doc,
                request:{
                    type: 'GET',
                    description:"GET_ALL_PRODUCT",
                    url:"http://localhost:3000/products/"
                }
        });
        }
        else{
            res.status(404).json({message:"Not valid Id"})
        }
    }).catch( err =>{ console.log(err);
    req.status(500).json({error  : err});
});
});


router.patch('/:productId',checkAuth,(req,res,next)=>{
    const id = req.params.productId;
    const updataeOps = {};
    for(const ops of req.body){
        updataeOps[ops.propName] = ops.value;
    }
    Products.update({_id : id},{ $set : updataeOps })
    .exec()
    .then(reslutPatch =>{
        console.log(reslutPatch);
        res.status(200).json(reslutPatch);
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error:err
        });
    });
});


router.delete('/:productId',checkAuth,(req,res,next)=>{
    const id = req.params.productId;
    Products.remove({_id : id}).exec().then(results => {
        console.log(results);
        res.status(200).json({results});
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error:err
        });
    });
});
module.exports = router;