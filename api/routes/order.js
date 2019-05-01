const express = require('express');
const router = express.Router();

router.get('/',(req,res,next)=>{
    res.status(200).json({
        message :"Order fetched"
    });
});

router.post('/',(req,res,next) =>{
    res.status(201).json({
        message:"order was created"
    });
});

router.get("/:orderId",(req,res,next)=>{
    const id= req.params.orderId;
   
     res.status(200).json({
         message:'Order details',
         orderId: id
     });

});



router.delete("/:orderId",(req,res,next)=>{
    res.status(200).json({
        message:'Delete product'
    });
   
});
module.exports = router;