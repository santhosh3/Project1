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






const getBlogs = async function (req, res) {
    try {
        let data = req.query;
        let blogsPresent = await blogModel.find({deleted : false, isPublished : true, ...data}).count()
        res.status(200).send({status : true, msg : blogsPresent})
    }
    catch (err) {
        res.status(500).send({status : false, msg: err.message})
    }
}





const Bloggs = async function(req, res) {
    try {
        let data = req.body
        let blogId = req.params.blogId

        if (!blogId) return res.status(400).send({ status: false, msg: "blogid is required" })
        let findblog = await blogModel.findById(blogId)
        if (!findblog) return res.status(404).send({ msg: "blogid invalid" })
        if (findblog.deleted == true) return res.status(404).send({ msg: "Blog is already deleted " })
        if (findblog.deleted == false) {
            let updatedBlog = await blogModel.findOneAndUpdate({ _id: blogId},{ 
                $set: {
                    title: data.title,
                    body: data.body,
                    category: data.category,
                    publishedAt:moment().format(),
                    isPublished: true
                },
               $push:  {
                    tags: req.body.tags,
                    subcategory: req.body.subcategory
                }
            }, { new: true, upsert: true })
            return res.status(200).send(updatedBlog)
        }
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
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





module.exports.createBlogger = createBlogger
module.exports.getBlogs = getBlogs
module.exports.Bloggs = Bloggs
module.exports.deleteblog = deleteblog
module.exports.deleteByElement = deleteByElement
