const { verify } = require("jsonwebtoken");
const { version } = require("mongoose");


module.exports = {
    
    database:
      'mongodb+srv://dhifalla:dhifalla@cluster0.yd7ad.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',  
    port: 3030,
    secret: 'dhifalla123',
    
  };
  