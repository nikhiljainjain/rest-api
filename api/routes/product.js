const express = require('express');
const router = express.Router();

router.get('/',(req,res,next)=>{
    res.status(200).json({
        message :"Get request"
    });
});

router.post('/',(req,res,next) =>{
    res.status(201).json({
        message:"Post request"
    });
});

router.get("/:productId",(req,res,next)=>{
    const id= req.params.productId;
   
    if(id==='special'){
        res.status(200).json({
            message:'You found id',
            id:id
        });
    }
    else{
     res.status(200).json({
         message:'you passed id'
     });
    }
});

router.patch("/:productId",(req,res,next)=>{
     res.status(200).json({
         message:'Updated product'
     });
    
});

router.delete("/:productId",(req,res,next)=>{
    res.status(200).json({
        message:'Delete product'
    });
   
});
module.exports = router;