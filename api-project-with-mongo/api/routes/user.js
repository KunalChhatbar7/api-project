const e = require('express');
const { request } = require('express');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { route } = require('./orders');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');

const User = require('../models/users');


router.post('/signup',(req,res,next)=>{
User.find({email: req.body.email}).exec().then(user=>{
    if(user.length >=1){
        console.log("Email is already userd");
        return res.status(422).json({
            message : 'Email is already userd'
        });
    }else{
        bcrypt.hash(req.body.password,10, (err,hash)=>{
            if(err){
                return res.status(500).json({
                    error : err
                });
            }else{
                const user =new User({
                    _id :new mongoose.Types.ObjectId(),
                    email: req.body.email,
                    password: hash,
                });
                user.save().then(result =>{
                    console.log(result);
                    res.status(201).json(
                        {
                            message: 'User Created'
                        }
                    );
                }).catch(err =>{
                    console.log(err);
                    res.status(500).json({
                        error:err   
                    });
                });
            }
        });
    }
})
});

router.post('/login',(req,res,next)=>{
    User.find({email : req.body.email})
    .exec()
    .then(user =>{
        if(user.length <1){
            return res.status(401).message({
                message :"Auth Failed"
            });
        }
        bcrypt.compare(req.body.password,user[0].password,(err,result)=>{
            if(err){
                return res.status(401).message({
                    message :"Auth Failed"
                });
            }
            if(result){
            const token = JWT.sign({
                    email: user[0].email,
                    userId : user[0]._id
                }, "Test",{
                    expiresIn: "1h"
                },)
                return res.status(200).json(
                    {
                        message :"Auth Successful",
                        Token : token 
                    }
                )
            }
            res.status(401).json({ 
                message :"Auth Failed"
            });
        })
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
           message : "Auth Failed"   
        });
    });
})
router.delete('/deletuser',(req,res,next)=>{
    User.find({email: req.body.email}).exec().then(user=>{}).catch();
    User.remove({email : req.body.email}).exec()
    .then(resuslt=>{
        res.status(200).json({
            message :"User deleted",
        });
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error:err   
        });
    });
});
module.exports = router;