const { regexpToText } = require("nodemon/lib/utils")
const authorModel = require("../models/authorModel")
const blogModel = require("../models/blogModel")
const moment = require("moment")




const createBlogger = async function (req, res) {
    try {
        const id = req.body.authorId;
        const checkId = await authorModel.findById(id);
        if (!checkId)
            return res.status(400).send({ status: false, msg: "provide valid author id" });
        const blogData = req.body;
        if (blogData.isPublished === false) {

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
            return res.status(404).send({status: false,  msg: "No Data Found"})
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
        const blogs = await blogModel.find(data).find({ isPublished: true, deleted: false }).populate('author')
        if (blogs.length == 0) return res.status(404).send({ status: false, msg: "No blogs Available." })
        res.status(200).send({ status: true, data: blogs });
    }
    catch (error) {
        res.status(500).send({ status: false, msg: error.message });
    }
}







const upData = async (req, res) => {
    try {
        let blogId = req.params.blogId;
        let user = await blogModel.findById(blogId);
        if (!user) {
            return res.send("No such user exists");
        }
        let data = req.body
        // let updatedData = await blogModel.findOneAndUpdate({ _id: userId },{$set : {title : data.title,body : data.body, tags :["small"]}})  
        let updatedData = await blogModel.findOneAndUpdate({ _id: blogId }, data, { new: true })

        res.send({ status: true, data: updatedData })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ msg: "error" })
    }

}

const status = async (req, res) => {
    try {
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
    catch (err) {
        console.log(err)
        res.status(500).send
    }
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

// const lastDelete = async function (req, res) {
//     try {
//         let filter = {};
//         if (req.query.category != undefined) {
//             filter['category'] = req.query.category;
//         }
//         if (req.query.authorId != undefined) {
//             filter['authorId'] = req.query.authorId;
//         }
//         if (req.query.tags != undefined) {
//             filter['tags'] = req.query.tags;
//         }
//         if (req.query.subCategory != undefined) {
//             filter['subCategory'] = req.query.subCategory;
//         }
//         if (req.query.unpublished != undefined) {
//             filter['isPublished'] = false;
//         }
//         let blog = await blogModel.updateMany(filter, { $set: { isDeleted: true } });
//         if (Object.keys(blog).length != 0) {
//             res.status(200).send({ status: true, msg: "Blog deleted successfully!" });
//         }
//         else {
//             res.status(404).send({ status: false, msg: "Blog doesn't exist!" });
//         }
//     }
//     catch (err) {
//         res.status(500).send({ status: false, msg: err.message });

//     }
// };






module.exports.createBlogger = createBlogger
module.exports.getBlogsData = getBlogsData
module.exports.getblog = getblog
module.exports.upData = upData
module.exports.status = status
module.exports.deleteblog = deleteblog
// module.exports.lastDelete = lastDelete
