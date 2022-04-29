
const AuthorModel = require("../models/authorModel")

const createAuthor1 = async function (req, res) {
    try {
        let data = req.body
        if (Object.keys(data).length != 0) {
            let savedData = await AuthorModel.create(data)
            res.status(200).send({ msg: savedData })
        }
        else {
            res.status(400).send({ msg: "Bad Request" })      // (400) = {the server cannot or will not process the request due to something that is perceived to be a client error}
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ msg: "error", err: err.message })
    }
}


// const createAuthor= async function (req, res) {
//     try{
//     let author = req.body

//     const{firstName,lastName,title,email,password}= author

//     const req0 = isValid(firstName)
//     if (!req0) return res.status(400).send('firstName is required')

//     const req1 = isValid(lastName)
//     if (!req1) return res.status(400).send('lastName is required')

//     const req2 = isValid(title)
//     if (!req2) return res.status(400).send('title is required')

//     if(!(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email))){
//         res.status(400).send({status: false , msg: "Email should be a valid email address"})
//     }

//     const req4 = isValid(password)
//     if (!req4) return res.status(400).send('password is required')

//     let authorCreated = await AuthorModel.create(author)
//     res.status(201).send({data: authorCreated})
//     }
//     catch (error) {
//         return res.status(500).send({msg: error.message})
//     }
// }

    //  module.exports.createAuthor = createAuthor
     module.exports.createAuthor1 = createAuthor1
