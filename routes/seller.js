const router = require('express').Router();
const Product = require('../models/product');
const faker = require('faker');
 
const multer = require('multer');
 const storage = multer.diskStorage({
   destination: function(req,file,cb){
     cb(null,'./uploads/');
   },
   filename:function(req,file,cb){
     cb(null,file.originalname)
   }
 })
 const upload = multer({storage: storage});

 
 

const checkJWT = require('../middlewares/check-jwt');

/*var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'amazonowebapplication',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString())
    }
  })
});*/


router.route('/products')
  .get(checkJWT, (req, res, next) => {
    Product.find({ owner: req.decoded.user._id })
      .populate('owner')
      .populate('category')
      .exec((err, products) => {
        if (products) {
          res.json({
            success: true,
            message: "Products",
            products: products
          });
        }
      });
  })
  .post([checkJWT, upload.single('product_picture')], (req, res, next) => {
    console.log(upload);
    console.log(req.file);
    let product = new Product();
    product.owner = req.decoded.user._id;
    product.category = req.body.categoryId;
    product.title = req.body.title;
    product.price = req.body.price;
    product.description = req.body.description;
    product.image = req.file.originalname;
    product.save();
    res.json({
      success: true,
      message: 'Successfully Added the product'
    });
  })
  .delete((req,res,next)=>{
    console.log("delet ??",req.body)
    Product.deleteOne({title: req.body.title}).then(
      () => {
        res.status(200).json({
          message: 'Deleted!'
        });
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );

  });



module.exports = router;
