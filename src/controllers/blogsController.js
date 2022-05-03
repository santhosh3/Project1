const { regexpToText } = require("nodemon/lib/utils")
const authorModel = require("../models/authorModel")
const blogModel = require("../models/blogModel")
const moment = require("moment")



// ### POST /blogs
// - Create a blog document from request body. Get authorId in request body only.
// - Make sure the authorId is a valid authorId by checking the author exist in the authors collection.
// - Return HTTP status 201 on a succesful blog creation. Also return the blog document. The response should be a JSON object like [this](#successful-response-structure) 
// - Create atleast 5 blogs for each author

// - Return HTTP status 400 for an invalid request with a response body like [this](#error-response-structure)

const createBlogger = async function (req, res) {
    try {
        const id = req.body.authorId;
        if (!id) return res.status(404).send({ status : false,msg: "id is compulsory" })
        const checkId = await authorModel.findById(id);
        if (!checkId)
            return res.status(400).send({ status: false, msg: "provide valid author id" });
        const blogData = req.body;
        if (blogData.isPublished === false) {       // doubts

            const blogCreation = await blogModel.create(blogData);
            return res.status(201).send({ status: true, data: blogCreation });
        } else {

            blogData.publishedAt = new Date();       // moment().format()
            const blogCreation = await blogModel.create(blogData);

            res.status(201).send({ status: true, data: blogCreation });
        }
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
};






//   ### GET /blogsReturns all blogs in the collection that aren't deleted and are published
//   - Return the HTTP status 200 if any documents are found. The response structure should be like [this](#successful-response-structure) 
//   - If no documents are found then return an HTTP status 404 with a response like [this](#error-response-structure) 

//   - Filter blogs list by applying filters. Query param can have any combination of below filters.
//     - By author Id
//     - By category
//     - List of blogs that have a specific tag
//     - List of blogs that have a specific subcategory
//   example of a query url: blogs?filtername=filtervalue&f2=fv2

const getBlogs = async function (req, res) {
    try {
        let data = req.query;
        let blogsPresent = await blogModel.find({ isDeleted: false, isPublished: true, ...data })// doubts in spread operator
        if(!blogsPresent) return res.status(404).send({status: false, msg : "No such Data"})
        if(blogsPresent.length == 0){
            return res.status(404).send({status: false,msg : "No blogs are present"})
        }
        res.status(200).send({ status: true, data: blogsPresent })
    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}

// const data = req.query
//         // if (Object.keys(data) == 0) return res.status(400).send({ status: false, msg: "No input provided" })

//         const blogs = await BlogModel.find({$and : [data, { isDeleted: false }, { isPublished: true }]}).populate("authorId")
//         if (blogs.length == 0) return res.status(404).send({ status: false, msg: "No blogs Available." })
//         return res.status(200).send({ status: true,count:blogs.length, data: blogs });




// ### PUT /blogs/:blogId
// - Updates a blog by changing the its title, body, adding tags, adding a subcategory. (Assuming tag and subcategory received in body is need to be added)
// -i.e. adds publishedAt date Updates a blog by changing its publish status  and set published to true
// - Check if the blogId exists (must have isDeleted false). If it doesn't, return an HTTP status 404 with a response body like [this](#error-response-structure)
// - Return an HTTP status 200 if updated successfully with a body like [this](#successful-response-structure) 
// - Also make sure in the response you return the updated blog document. 

const Bloggs = async function (req, res) {
    try {
        let blogId = req.params.blogId
        let data = req.body

        if (!blogId) return res.status(404).send({ status: false, msg: "blogid is required" })
        let findblog = await blogModel.findById(blogId)
        if (!findblog) return res.status(404).send({ status: false,msg: "blogid invalid" })
      
        if (findblog.isDeleted == true) return res.status(404).send({ msg: "Blog is already deleted " })
        if (findblog.isDeleted == false) {
            let updatedBlog = await blogModel.findOneAndUpdate({ _id: blogId }, {
                $set: {
                    title: data.title,
                    body: data.body,
                    category: data.category,
                    publishedAt: moment().format(),  // new Date()
                    isPublished: true
                },
                $push: {
                    tags: req.body.tags,
                    subcategory: req.body.subcategory
                }
            }, { new: true, upsert: true })
            return res.status(200).send({ status: true,data:updatedBlog})
        }
    } catch (err) {
        console.log(err)
        res.status(500).send({ status: false, msg: err.message });
    }
}





// ### DELETE /blogs/:blogId
// - Check if the blogId exists( and is not deleted). If it does, mark it deleted and return an HTTP status 200 without any response body.
// - If the blog document doesn't exist then return an HTTP status of 404 with a body like [this](#error-response-structure) 

const deleteblog = async function (req, res) {

    try {
        let Blogid = req.params.blogId
        if (!Blogid) return res.status(404).send({status : false, msg: "Blogid is required" })

        let check = await blogModel.findOne({ _id: Blogid })
        if (!check) return res.status(404).send({ status:false,msg :'Blog not exist'})

        let checking = check.isDeleted
        if (checking == false) {
            let deleteBlog = await blogModel.findOneAndUpdate({ _id: Blogid }, { isDeleted: true, deletedAt: new Date() }, { new: true }) // we can change new Date() to moment().format()
            return res.status(200).send({ status:true,msg: "blog is deleted successfully" })
        } else {
            res.status(404).send({
                status: false,
                msg: "Already deleted"
            })
        }
    } catch (error) {
        console.log(err)
        res.status(500).send({ status: false, msg: error.message });
    }

}




// ### DELETE /blogs?queryParams
// - Delete blog documents by y, authorid, tag name, subcategory name, published=false
// - If the blog document doesn't exist then return an HTTP status of 404 with a body like [this](#error-response-structure)

const deleteByElement = async function (req, res) {

    try {
        let data = req.query
        let filter = {...data}

        if (!data) return res.status(404).send({status: false, msg: " data is required in query params" })
        let check = await blogModel.findOne(filter)
        if (!check) return res.status(404).send({ status: false, msg: "blog does not exist" })
        if (check.isDeleted == true) return res.status(404).send({ status: false, msg: " blog is already deleted" })
        if (check.isDeleted == false) {
            let idList = check._id
            console.log(idList)
            let deletion = await blogModel.findOneAndUpdate(filter, { $set: { isDeleted: true, deletedAt: new Date()} },{new : true , upsert: true})
            return res.status(200).send({ status: true, msg: "blog is deleted successfully" })
        }
    }
    
    catch (err) {
        console.log(err)
        res.status(500).send({ status : false,msg: "error", err: err.message })
    }
}




module.exports.createBlogger = createBlogger
module.exports.getBlogs = getBlogs
module.exports.Bloggs = Bloggs
module.exports.deleteblog = deleteblog
module.exports.deleteByElement = deleteByElement
