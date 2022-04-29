const { regexpToText } = require("nodemon/lib/utils")
const authorModel = require("../models/authorModel")
const blogModel = require("../models/blogModel")
const moment = require("moment")




const createBlogger = async function (req, res) {
    try {
      const id = req.body.authorId;
      if(!id) return res.status(404).send({msg :"id is compulsory"})
      const checkId = await authorModel.findById(id);
      if (!checkId)
        return res.status(400).send({ status: false, msg: "provide valid author id" });
      const blogData = req.body;
      if (blogData.isPublished === false || blogData.delete) {
  
        const blogCreation = await blogModel.create(blogData);
        return res.status(201).send({ status: true, data: blogCreation });
      } else {
  
        blogData.publishedAt = new Date();
        const blogCreation = await blogModel.create(blogData);
  
        res.status(201).send({ status: true, data: blogCreation });
      }
    } catch (err) {
      res.status(500).send({ status: false, msg: err.message });
    }
  };









const getBlogsData = async function (req, res) {
    try {
        let list = await blogModel.find({ deleted: false, isPublished: true }).select({ _id: 0 })
        if (!list) {
            return res.status(404).send({ status: false, msg: "No Data Found" })
        }
        res.status(200).send({
            status: true,
            data: {
                list
            }
        })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ msg: "error", err: err.message })
    }
}

const getblog = async function (req, res) {
    try {
        const data = req.query
        if (Object.keys(data).length != 0) {
            const blogs = await blogModel.find(data).find({ isPublished: true, deleted: false })//.populate('author')
            if (blogs.length == 0) return res.status(404).send({ status: false, msg: "No blogs Available." })
            res.status(200).send({ status: true, data: blogs });
        }
        else {
            res.status(400).send({ msg: "Bad Request" })      // (400) = {the server cannot or will not process the request due to something that is perceived to be a client error}
        }
    }
    catch (error) {
        res.status(500).send({ status: false, msg: error.message });
    }
}







const upData = async (req, res) => {
    try {
        let blogId = req.params.blogId;
        if (!blogId) return res.status(404).send({ msg: "blogId is compulsory" })
        let user = await blogModel.findById(blogId);
        if (!user) {
            return res.send("No such user exists");
        }
        let data = req.body
        // let updatedData = await blogModel.findOneAndUpdate({ _id: userId },{$set : {title : data.title,body : data.body, tags :["small"]}}) 
        if (Object.keys(data).length != 0) {
            let updatedData = await blogModel.findOneAndUpdate({ _id: blogId }, data, { new: true })
            res.send({ status: true, data: updatedData })
        } else {
            res.status(400).send({ msg: "Bad Request" })
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ msg: "error" })
    }

}

const status = async (req, res) => {
    try {
        let blogId = req.params.blogId;
        if (!blogId) return res.status(404).send({ msg: "userId is compulsory" })
        let user = await blogModel.findById(blogId);
        if (!user) {
            return res.send("No such user exists");
        }
        let isPublished = await blogModel.findOne({ _id: blogId, isPublished: true })
        if (!isPublished) {
            return res.status(404).send("ispublished must be true")
        }
        var CurrentDate = moment().format("YYYY-MM-DD hh:mm:ss");
        let updatedData = await blogModel.findOneAndUpdate({ _id: blogId }, { $set: { CurrentDate } }, { new: true, upsert: true });


        res.status(200).send({ status: true, data: updatedData })
    }
    catch (err) {
        console.log(err)
        res.status(500).send
    }
}







const deleteblog = async function (req, res) {

    try {
        let Blogid = req.params.blogId
        if (!Blogid) return res.status(404).send({ msg: "Blogid is required" })

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

const deleteByElement = async function (req, res) {
    try {
        let data = req.query
        if (!data) return res.status(404).send({ msg: " data is required in query params" })
        if (Object.keys(data) == 0) return res.status(400).send({ status: false, msg: "not a vaild input" })

        let check = await blogModel.find(data)
        if (!check) return res.status(404).send('Blog not exist')
        console.log(check)

        const deleteBYquery = await blogModel.updateMany({ $and: [data, { deleted: false }, { isPublished: false }] }, { $set: { deleted: true, deletedAt: new Date() } })
        if (deleteBYquery.modifiedCount == 0) return res.status(400).send('user already deleted')

        if (!deleteBYquery) return res.status(404).send({ status: false, msg: "blog not exist" })
        res.status(200).send({ status: true, msg: deleteBYquery })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ msg: "error", err: err.message })
   
    }
}




module.exports = {  createBlogger,  getBlogsData  , getblog,upData , status,deleteblog  ,  deleteByElement}  
// module.exports.createBlogger = createBlogger
// module.exports.getBlogsData = getBlogsData
// module.exports.getblog = getblog
// module.exports.upData = upData
// module.exports.status = status
// module.exports.deleteblog = deleteblog
// module.exports.deleteByElement = deleteByElement
