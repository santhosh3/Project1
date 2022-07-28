const jwt = require("jsonwebtoken");
const authorModel = require("../models/authorModel");

const validRequestBody = function(requestBody){
  return Object.keys(requestBody).length > 0
}

const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false
  if (typeof value === "string" && value.trim().length === 0) return false
  return true
}

const loginAuthor = async function(req,res){
  try{
      const body = req.body
      if(!validRequestBody(body)){
          return res.status(400).send({status:false,mess:"Please provide login details"})
      }
      const {email,password} = body
      if(!isValid(email) && !isValid(password)){
          return res.status(400).send({status:false,mess:"Mandetory things are missing"})
      }
      if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
        return res.status(400).send({ status: false, message: "please provide valid Email" })
      }
      let author = await authorModel.findOne({email,password});
      if(!author){
          return res.status(400).send({status:false, mess: "Invalid login credentials"})
      }
      let token =  jwt.sign({
          authorid:author._id,
          iat: Math.floor(Date.now()/1000),
          exp: Math.floor(Date.now()/1000)+10*60*60,
      }, 'project1')
      res.header('x-api-key', token);
      res.status(200).send({status:true, mess:"Athor login is successful", data:{token}})
  }catch(error){
      res.status(500).send({status:false,mess:error.message})
  }
}

module.exports.loginAuthor = loginAuthor
