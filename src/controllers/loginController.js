const jwt = require("jsonwebtoken");
const blogModel = require("../models/blogModel");
const authorModel = require("../models/authorModel");


const loginUser = async function (req, res) {
  try {
    let userName = req.body.email;
    let password = req.body.password;
    if (Object.keys(userName).length != 0 && Object.keys(password).length != 0) {
      let user = await authorModel.findOne({ email: userName, password: password });
      if (!user)
        return res.status(403).send({           // (403) = {meaning access to the requested resource which is forbidden for some reason }
          status: false,
          msg: "username or the password is not correct",
        });

      let token = jwt.sign(
        {
          userId: user._id.toString(),
          batch: "uranium-Project",
          organisation: "FUnctionUp-login",
        },
        "project1-group3"
      );
      console.log(token)
      
      res.status(200).send({ status: true, data: token });    // (200) = 
    }
    else {
      res.status(400).send({ msg: "Bad Request" })       // (400) = {the server cannot or will not process the request due to something that is perceived to be a client error }
    }
  }
  catch (err) {
    console.log(err.message)
    res.status(500).send({ msg: "Error", Error: err.message })  // (500) = {Internal server error that prevents it from fullfilling  the request}
  }
};

module.exports.loginUser = loginUser
