const mongoose = require('mongoose')
const jwt = require('jsonwebtoken');
const blogModel = require('../models/blogModel');


const isValidObjectId = (ObjectId) => {              //checks if a string is valid MongoDB ObjectId in Node.js
  return mongoose.Types.ObjectId.isValid(ObjectId);
};




// const authentication = (req, res, next) => {
//   try {
//     let token = req.headers["x-Api-key"];                   //getting token from header

//     if (!token) {                                          //if token is not present 

//       token = req.headers["x-api-key"];                  //getting token from header
//     }
//     if (!token) {

//       return res.status(401).send({ status: false, msg: "Token must be present" });
//     }
//     let decodedToken = jwt.verify(token, "project1-group3");              //verifying token with secret key


//     if (!decodedToken) return res.status(401).send({ status: false, msg: "Token is incorrect" });

//     next();                                                               //if token is correct then next function will be called respectively
//   }
//   catch (err) {
//     res.status(500).send({ status: false, msg: err.message });
//   }
// }

const authentication = async function (req,res,next){
  try{
    let token = req.headers["x-api-key"] 
      console.log(token)
      if(!token){
          return res.status(403).send({status:false,message:"Missing authentication token"})
      }
      const decoded =  jwt.verify(token,'project1')
      if(!decoded){
          return res.status(403).send({status:false,mess:"Invalid authentication token"})
      }
      req.authorId = decoded.authorId
      next()
  }catch(error){
      res.status(500).send({status:false,mess:error.message})
}
}

module.exports = {authentication};