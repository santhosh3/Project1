
const authorModel = require("../models/authorModel")

const validRequestBody = function(requestBody){
    return Object.keys(requestBody).length > 0
}

const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false
    if (typeof value === "string" && value.trim().length === 0) return false
    return true
}

const isValidTitle = function (title) {
    title = title.trim()
    return ["Mr", "Miss", "Mrs"].indexOf(title) !== -1
}

const createAuthor1 = async function(req,res){
    try {
        let body = req.body
        if (!validRequestBody(body)) {
            return res.status(400).send({ status: false, message: "Invalid request parameters please provide user details" })
        }
        const { title, fname, lname, email, password, } = req.body
        if (!isValid(title)) {
            return res.status(400).send({ status: false, message: " title is required" })
        }
        if (!isValidTitle(title)) {
            return res.status(400).send({ status: false, message: "title can only be Mr, Ms , Mrs" })
        }
        if (!isValid(fname)) {
            return res.status(400).send({ status: false, message: "fname is required" })
        }
        if (!isValid(lname)) {
            return res.status(400).send({ status: false, message: " lname is required" })
        }
        if (!isValid(email)) {
            return res.status(400).send({ status: false, message: "Email is required" })
        }
        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
            return res.status(400).send({ status: false, message: "Email should be valid" })
        }
        if (!isValid(password)) {
            return res.status(400).send({ status: false, message: "Password is required" })
        }
        const isEmailPresent = await authorModel.findOne({ email: email })
        if (isEmailPresent) {
            return res.status(409).send({ status: false, message: "email address is already registered" })
        }
        const user = await authorModel.create(body)
        res.status(201).send({ status: true, message: "created successfully", data: user })
    }
    catch (err) {
        res.status(500).send({ status: false, data: err.message })
    }
  }


module.exports.createAuthor1 = createAuthor1
