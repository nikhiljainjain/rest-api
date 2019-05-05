const express = require('express');
const router = express.Router();
const mongoose =require('mongoose');
const Order=require('../models/order');
const Product=require('../models/product');
const checkAuth = require('../middleware/check-auth');
require('dotenv').config({ path: '.../nodemon.json' })

router.get('/',checkAuth,(req,res,next)=>{
    Order.find()
    .select('productId quantity _id')
    .populate('product','name')
    .then(docs=>{res.status(200).json({
        count :docs.length,
        orders: docs.map(doc=>{
            return{
                _id:doc._id,
                productId:doc.productId,
                quantity:doc.quantity,
                request:{
                    type:'GET',
                    url:'http://localhost:3000/orders'+doc._id
                }
            }
        })
    })
})
    .catch(err=>{res.status(500).json({error:err})})
    
});

router.post('/',checkAuth,(req,res,next) =>{
    Product.findById(req.body.productId)
    .then(product=>{
        if(!product)
        {
            return res.status(404).json({
                message:'Product not found'
            });
        }
        const order =new Order({
            _id:mongoose.Types.ObjectId(),
            quantity:req.body.quantity,
            productId:req.body.productId
        });
    return order.save();
    })
    .then(result=>{
        console.log(result);
        res.status(201).json({
            message:"order was created",
            createdorder:{
                _id:result._id,
                productId:result.productId,
                quantity:result.quantity,
                request:{
                    type:'GET',
                    url:'http://localhost:3000/orders/'+result._id
                }

            }
    
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error:err});
    })

    

    
});

router.get("/:orderId",checkAuth,(req,res,next)=>{
    const id= req.params.orderId;
    Order.findById(id)
    .populate('product')
    .select('_id productId quantity')
    .then(order=>{
        if(!order){return res.status(404).json({messgae:'Order not found'})}
        res.status(200).json({
         order:order
        });
    })
    .catch(err=>res.status(500).json({error:err}));

});



router.delete("/:orderId",checkAuth,(req,res,next)=>{
    Order.remove({_id:req.params.orderId})
    .then(
        res.status(200).json({message:'Deleted order'}))
    .catch(err=>res.status(500).json({error:err}));
   
});
module.exports = router;