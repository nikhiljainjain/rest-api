const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const mongoose = require("mongoose");
const multer = require('multer'); //allows parsing of binary data i.e files
const checkAuth = require('../middleware/check-auth');
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads/')
    },
    filename:(req,file,cb)=>{
        cb(null,new Date().toISOString().replace(/:/g,'-')+'-'+file.originalname);
    }
});
//accepting and rejecting file
// const fileFilter=(req,file,cb)=>{
//     if(file.mimetype==='image/jpeg' || file.mimetype==='image/png'){
//         cb(null,true);
//     }else{
//         cb(null,false);
//     }
    
// }


const upload = multer({storage:storage,limits:{fileSize:1024*1024*5}});

router.get('/',(req,res,next)=>{
    Product.find()
    .select('name price _id productImage') ///fetches only these three fields 
    .exec()
    .then(docs=>{
        const response ={
            count : docs.length ,
            product :docs.map(doc=>{
                return{
                    name: doc.name,
                    price:doc.price,
                    _id:doc._id,
                    productImage:doc.productImage,
                    request:{
                        type:'GET',
                        url :'http://localhost:3000/products/'+ doc._id
                    }
                }
            })

            }
            res.status(200).json({response});
        })
        
        
    .catch(err=>{
        res.status(500).json({error:err});}
    )
    
});

router.post('/',checkAuth,upload.single('productImage'),(req,res,next) =>{
    console.log(req.file);
     const product = new Product({
         _id : new mongoose.Types.ObjectId(),
         name : req.body.name,
         price: req.body.price,
         productImage:req.file.path
     });
    product.save()
    .then(result => {console.log(result);
        res.status(201).json({
            message:"Created Product succesfully",
            product: {
               product:result,
                request:{
                    type:'GET',
                    url:"http://localhost:3000/products/"+result._id
                }

            }
        });})
    .catch(err=>{console.log(err);
    res.status(500).json({error:err})}
    )
    
});

router.get("/:productId",(req,res,next)=>{
    const id= req.params.productId;
   Product.findById(id)
   .select('name price _id productImage')
   .then(doc=>{
        console.log(doc);
        if(doc){res.status(200).json({
            product:doc
        });}
        else{res.status(404).json({message :'not found'})
        }
        })
   .catch(err=>{
       console.log(err);
       res.status(500).json({error:err});
    });
    
});

router.patch("/:productId",checkAuth,(req,res,next)=>{
    const id=req.params.productId;
    const updateOps ={};
    for(const ops of req.body){
        updateOps[ops.propName]=ops.value;
    }
    Product.updateOne({_id:id},{$set:updateOps}).exec()
    .then(result=>{
        res.status(200).json({
            message:'Product successfuly updated',
            request:{
                type:'GET',
                url:'http://localhost:3000/products/' + id
            }
        });
    })
    .catch(err=>{
        res.status(500).json({error:err});
    })
       
    
});

router.delete("/:productId",checkAuth,(req,res,next)=>{
    const id=req.params.productId;
  
    Product.remove({_id:id})
    .then(result=>{
        res.status(200).json({
            message:'Product successfuly deleted'
        })

    .catch(err => {
        res.status(500).json({error:err});
    })
})  
   
});
module.exports = router;