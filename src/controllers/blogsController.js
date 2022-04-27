const { regexpToText } = require("nodemon/lib/utils")
const authorModel = require("../models/authorModel")
const blogModel = require("../models/blogModel")
const moment = require("moment")

const createBlogs = async function (req, res) {
    let data = req.body
    if (!data.authorId) {
        return res.send({ msg: "authorId should be present" })
    }
    let userId = await authorModel.findById(data.authorId)
    if (!userId) {
        return res.send({ msg: "Invalid AuthorId" })
    }
    // let data1 = req.body.isPublished
    // if (data1 === true){
    //     // let data2 = await blogModel.find(data.authorId ,publishedAt )
    //     // let data2 =  req.body.publishedAt//await blogModel.find(data.publishedAt)//req.body.publishedAt
    //     // return res.send({msg : data2})
    //     let  publishedAt = moment().format("YYYY-MM-DD hh:mm:ss")
    //     // return res.send({publishedAt})
    //     let updateData = await blogModel.updateMany(

    //             {isPublished : true},
    //            {$set :{publishedAt}},
    //            {new : true, upsert : true}
    //            )


    let savedData = await blogModel.create(data)
    return res.send({ msg: savedData, updateData })
}

// let data3 = req.body.deleted
// if (data3 = true){
//    let data4 = req.body.deletedAt
//    data4 = Date


// let savedData = await blogModel.create(data)
// res.send({ msg: savedData })




const getBlogsData = async function (req, res) {
    let list = await blogModel.find({ deleted: false, isPublished: true }).select({ _id: 0 })
    if (!list) {
        return res.status(404).send({
            status: false,
            msg: "No Data Found"
        })
    }
    res.status(200).send({
        status: true,
        data: {
            list
        }
    })
}


// const GetFilteredBlog = async function (req, res) {
//     let data = await blogModel.find({ $and: [{ deleted: false }, { isPublished: true }] })
//     try {
//       if (!data) {
//         let authId = req.query.authorId
//         let cat = req.query.category
//         let subcat = req.query.subcategory
//         let tag = req.query.tags
//         let allData = await blogModel.find({ $or: [{ authorId: authId }, { category: cat }, { subcategory: subcat }, { tags: tag }] })
//         if (allData.length!=0) return res.status(400).send({msg:"enter valid queries"})
//         // console.log(allData);

//         res.send({ status: true, msg: allData })
//       } else {
//         return res.status(404).send({ msg: "Not Found" });
//       }
//     } catch (err) {
//       res.status(500).send({ status: false, msg: "Error", err: err.message })
//     }
//   }

const filtersBlogs = async function (req, res) {
    let id = req.query.authorId
    let cat = req.query.category
    let blogsTags = req.query.tags
    let blogSc = req.query.subcategory
    let blogDetails = await blogModel.find({ $or: [{ authorId: id }, { category: cat }, { subcategory: blogSc }, { tags: blogsTags }] })
    res.status(201).send({ data: blogDetails })
}

// const filterData = async (req,res) =>
// {
//     let authorId = req.query.authorId
//     let category = req.query.category
//     let tags = req.query.tags
//     let subcategory = req.query.subcategory
//     let data = await blogModel.find({authorId : authorId, category : category, tags :{$in:[tags]}, subcategory : {$in:[subcategory]} })
//     res.status(200).send({status : true, msg : data})
// }


const upData = async (req, res) => {
    let userId = req.params.userId;
    let user = await blogModel.findById(userId);
    if (!user) {
        return res.send("No such user exists");
    }
    // let userData = req.body;  //we need write in postman in JSON by adding tags and subcategory
    let data = req.body
    // let updatedData = await blogModel.findOneAndUpdate({ _id: userId },{$set : {title : data.title,body : data.body, tags :["small"]}})  
    let updatedData = await blogModel.findOneAndUpdate({ _id: userId }, data, { new: true })

    res.send({ status: true, data: updatedData })

}


const status = async (req, res) => {
    let userId = req.params.userId;
    let user = await blogModel.findById(userId);
    if (!user) {
        return res.send("No such user exists");
    }
    let isPublished = await blogModel.findOne({ _id: userId, isPublished: true })
    if (!isPublished) {
        return res.status(404).send("ispublished must be true")
    }
    var CurrentDate = moment().format("YYYY-MM-DD hh:mm:ss");
    let updatedData = await blogModel.findOneAndUpdate({ _id: userId }, { $set: { CurrentDate } }, { new: true, upsert: true });


    res.status(200).send({ status: true, data: updatedData })
}





const deleteblog = async function (req, res) {

    try {
        let Blogid = req.params.blogId

        let check = await blogModel.findOne({ _id: Blogid })
        if (!check) return res.status(404).send('Blog not exist')

        let checking = check.deleted
        if (checking == false) {

            let deleteBlog = await blogModel.findOneAndUpdate({ _id: Blogid }, { deleted: true, deletedAt: new Date() }, { new: true })
            return res.status(200).send({ msg: "blog is deleted successfully" })
        } else {
            res.status(404).send({
                status: false,
                msg: "Already deleted"
            })

        }
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message });
    }

}





const deleteByElememt1 = async function (req, res) {
    try {
        let data = req.query
        let check = await blogModel.find(data)
        if (!check)
            return res.status(404).send({ msg: " blog document doesn't exist" })
        console.log(check)
        const deleteByquery = await blogModel.updateMany({ $and: [data, { deleted: false }, { isPublished: false }] }, { $set: { deleted: true, deletedAt: new Date() } })
        //if (deleteByquery.modifiedCount == 0)
        return res.status(400).send('user already deleted')
        if (!deleteByquery) {return res.status(404).send({ status: false, msg: "blog not exist " })}
        res.status(200).send({ status: true, msg: deleteByquery })
    }

    catch (error) {
        res.status(500).send({ status: false, msg: error.message });
    }
}

const deleteByElememt = async function(req,res){
    let authorId = req.query.authorId
    let cat = req.query.category
    let subCat = req.query.subcategory
    let isPub =req.query.isPublished
    let tags =req.query.tags
    let check = await blogModel.findOneAndUpdate({ $or: [{ authorId: authorId }, { category: cat }, { subcategory: subCat }, { tags: tags },{isPublished : isPub}] })
    if (!check){
            return res.status(404).send({ msg: " blog document doesn't exist" })}
        // console.log(check)
        else {
            return res.status(400).send('user already deleted')

        }

}

// module.exports.updateData = updateData



module.exports.createBlogs = createBlogs
module.exports.getBlogsData = getBlogsData
// module.exports.GetFilteredBlog = GetFilteredBlog
module.exports.filtersBlogs = filtersBlogs
// module.exports.filterData = filterData
module.exports.upData = upData
module.exports.status = status
module.exports.deleteblog= deleteblog
module.exports.deleteByElememt= deleteByElememt
module.exports.deleteByElememt1 =deleteByElememt1
