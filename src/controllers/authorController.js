const jwt = require("jsonwebtoken")
const AuthorModel = require("../models/authorModel")



const createAuthor1 = async function (req, res) {
    try {
        let data = req.body;
        console.log(Object.keys(data))
        if (Object.keys(data).length != 0) {   //
            let savedData = await AuthorModel.create(data)
            res.status(201).send({status : true, data: savedData })            // change to 201
        }
        else {
            res.status(400).send({status:false, data: "Bad Request" })      // (400) = {the server cannot or will not process the request due to something that is perceived to be a client error}
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).send({status: false, msg: "error", err: err.message })
    }
}



module.exports.createAuthor1 = createAuthor1
