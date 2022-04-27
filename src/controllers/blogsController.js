const authorModel = require("../models/authorModel")
const blogModel = require("../models/blogModel")
// const moment = require("moment")

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
         return res.send({msg : savedData,updateData})
    }
    
    // let data3 = req.body.deleted
    // if (data3 = true){
    //    let data4 = req.body.deletedAt
    //    data4 = Date

    
    // let savedData = await blogModel.create(data)
    // res.send({ msg: savedData })




const getBlogsData = async function (req, res) {
    let list = await blogModel.find( {deleted: false ,  isPublished: true} ).select({_id:0})
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


// const filtersBlogs = async function (req, res) {
//     let id = req.query.authorId
//     let cat = req.query.category
//     // let blogsTags = req.query.tags
//     // let blogSc = req.query.subcategory
//     let blogDetails = await authorModel.find({ authorId: id , category : cat})
//     res.status(201).send({ data: blogDetails })
// }

const filterData = async (req,res) =>
{
    let authorId = req.query.authorId
    let category = req.query.category
    let tags = req.query.tags
    let subcategory = req.query.subcategory
    let data = await blogModel.find({authorId : authorId, category : category, tags :{$in:[tags]}, subcategory : {$in:[subcategory]} })
    res.status(200).send({status : true, msg : data})
}

module.exports.filterData = filterData


const updateData = async (req, res) =>
{

    let userId = req.params.userId;
    let user = await authorModel.findById(userId);
    if (!user) 
    {
      return res.send("No such user exists");
    }
    let userData = req.body;  //we need write in postman in JSON by adding tags and subcategory
    let updatedData = await blogModel.findOneAndUpdate({ _id: userId }, 
                                                       {$set:{userData}});
    res.send({ status: updatedData, data: updatedData })
    
}
module.exports.updateData = updateData



module.exports.createBlogs = createBlogs
module.exports.getBlogsData = getBlogsData
// module.exports.filtersData = filtersData