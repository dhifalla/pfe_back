const router = require('express').Router();
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const config = require('../config');
const checkJWT = require('../middlewares/check-jwt');
const product = require('../models/product');
const req = require('express/lib/request');



const client = require('twilio')("ACfb55b57d40e7859a5fa48b77c39b6b34", "e926559ce0ffede78d722ce523f012de");
 num ="te";
 var valid="bb";

router.post('/signup', (req, res, next) => {
 let user = new User();
 user.name = req.body.name;
 user.phonenumber = num;
 user.password = req.body.password;
 user.picture = user.gravatar();
 user.isSeller = req.body.isSeller;

 
    user.save();

    var token = jwt.sign({
      user: user
    }, config.secret, {
      expiresIn: '7d'
    });

    res.json({
      success: true,
      message: 'Enjoy your token',
      token: token
    });
 
});
router.get('/userlist', (req, res, next) => {
  User.find({}, (err, Users) => {
    res.json({
      success: true,
      message: "Success",
      users: Users
    })
  })
  
 });
 router.delete('/delete',async(req,res,next)=>{
  let a=await User.findOne({name:req.body.name})
  console.log("aaaaaaa",a)
  let b=await product.deleteMany({owner:  a._id})
  console.log("bbbbb",b)
  User.deleteOne({name: req.body.name}).then(
    
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

 

router.post('/login', (req, res, next) => {

  User.findOne({ phonenumber: req.body.phonenumber }, (err, user) => {
    if (err) throw err;

    if (!user) {
      res.json({
        success: false,
        message: 'Authenticated failed, User not found'
      });
    } else if (user) {

      var validPassword = user.comparePassword(req.body.password);
      if (!validPassword) {
        res.json({
          success: false,
          message: 'Authentication failed. Wrong password'
        });
      } else {
        var token = jwt.sign({
          user: user
        }, config.secret, {
          expiresIn: '7d'
        });

        res.json({
          success: true,
          mesage: "Enjoy your token",
          token: token
        });
      }
    }

  });
});
router.post('/send', (req, res, next) => {
  User.findOne({ phonenumber: req.body.phonenumber }, (err, existingUser) => {
    if (existingUser) {
      console.log("ex",existingUser)
      res.json({
        success: false,
        message: 'Account with that number is already exist'
      });

    } else {



     let a=req.body.phonenumber;
     console.log("aaa",a)
  
    client
    .verify
    .services("VA5b0e7615aabf020950174883c5e1e6c0")
    .verifications
    .create({
        to: a,
        channel: 'sms' 
    })
    .then(data => {

        res.status(200).send({
            message: "Verification is sent!!",
            success: true,
           
         
           
        });num=a
      
        
    }) 

  }})
 
});
router.post('/verif', (req, res, next) => {
  
  
 
    client
        .verify
        .services("VA5b0e7615aabf020950174883c5e1e6c0")
        .verificationChecks
        .create({
            to: num,
            code: req.body.code
        })
        .then(data => {
            if (data.status === "approved") {
                res.status(200).send({
                    message: "User is Verified!!",
                 
                   
                  
                });  valid=true
                
            }
        })


});
router.route('/profile')
  .get(checkJWT, (req, res, next) => {
    User.findOne({ _id: req.decoded.user._id }, (err, user) => {
      res.json({
        success: true,
        user: user,
        message: "Successful"
      });
    });
  })
  .post(checkJWT, (req, res, next) => {
    User.findOne({ _id: req.decoded.user._id }, (err, user) => {
      if (err) return next(err);

      if (req.body.name) user.name = req.body.name;
      if (req.body.phonenumber) user.phonenumber = req.body.phonenumber;
      if (req.body.password) user.password = req.body.password;

      user.isSeller = req.body.isSeller;

      user.save();
      res.json({
        success: true,
        message: 'Successfully edited your profile'
      });
    });
  });

  router.route('/address')
  .get(checkJWT, (req, res, next) => {
    User.findOne({ _id: req.decoded.user._id }, (err, user) => {
      res.json({
        success: true,
        address: user.address,
        message: "Successful"
      });
    });
  })
  .post(checkJWT, (req, res, next) => {
    User.findOne({ _id: req.decoded.user._id }, (err, user) => {
      if (err) return next(err);

      if (req.body.addr1) user.address.addr1 = req.body.addr1;
      if (req.body.addr2) user.address.addr2 = req.body.addr2;
      if (req.body.city) user.address.city = req.body.city;
      if (req.body.state) user.address.state = req.body.state;
      if (req.body.country) user.address.country = req.body.country;
      if (req.body.postalCode) user.address.postalCode = req.body.postalCode;
     
      user.save();
      res.json({
        success: true,
        message: 'Successfully edited your address'
      });
    });
  });


module.exports = router;
