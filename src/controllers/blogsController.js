const mongoose = require("mongoose")
const { regexpToText } = require("nodemon/lib/utils")
const authorModel = require("../models/authorModel")
const blogModel = require("../models/blogModel")
const moment = require("moment")

const validRequestBody = function(requestBody){
    return Object.keys(requestBody).length > 0
}

const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false
    if (typeof value === "string" && value.trim().length === 0) return false
    return true
}
const isValidObjectId = function(objectId){
    return mongoose.Types.ObjectId.isValid(objectId)
}
const isValidTitle = function (title) {
    return ["Mr", "Mrs", "Miss", "Mast"].indexOf(title) !== -1
}

// ### POST /blogs
// - Create a blog document from request body. Get authorId in request body only.
// - Make sure the authorId is a valid authorId by checking the author exist in the authors collection.
// - Return HTTP status 201 on a succesful blog creation. Also return the blog document. The response should be a JSON object like [this](#successful-response-structure) 
// - Create atleast 5 blogs for each author

// - Return HTTP status 400 for an invalid request with a response body like [this](#error-response-structure)

const createBlogger = async function(req,res){
    try{
        const data = req.body
        if(!validRequestBody(data)){
            return res.status(400).send({status:false,mess:"Please provide login details"})
        }
        const{title,body,authorId,tags,category,subcategory,isPublished} = data
        if(!isValid(title) && !isValid(body) && !isValid(authorId) && !isValid(tags) && !isValid(tags) && !isValid(subcategory),!isValid(category)){
            return res.status(400).send({status:false,mess:"Mandetory things are missing"})
        }
        if(!isValidObjectId(authorId)){
            res.status(400).send({status:false,mess:"please provide valid authorId"})
        }
        let author = await authorModel.findById(authorId)
        if(!author){
            return res.status(400).send({status:false,mess:"Author doesnot exit"})
        }
        if(!isValidTitle(title)){
            return res.status(400).send({status:false,message:"Please enter valid enum values"})
        }
        const blogData = {
            title,
            body,
            authorId,
            category,
            isPublished: isPublished ? isPublished : false,
            publishedAt: isPublished ? new Date() : null
        }
        if(tags){
            if(Array.isArray(tags)){
                blogData['tags'] = [...tags]
            }
        }
        if(subcategory){
            if(Array.isArray(subcategory)){
                blogData['tags'] = [...subcategory]
            }
        }
        const newBlog = await blogModel.create(blogData)
        return res.status(201).send({status:true, mess:"New blog created successfully", data:newBlog})
    }catch(error){
        res.status(500).send({status:false,mess:error.message})
  }
}

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
    try{
        const filterQuery = {isDeleted: false, deletedAt: null, publishedAt: true}
        const queryParams = req.query
        if(validRequestBody(queryParams)){
            const {authorId,category,tags,subcategory} = queryParams
            if(isValid(authorId) && isValidObjectId(authorId)){
                filterQuery["authorId"] = authorId
            }
            if(isValid(category)){
                filterQuery["category"] = category.trim()
            }
            if(isValid(tags)){
                const tagsArr = tags.trim().split(',').map(tags => tags.trim())
                filterQuery["tags"] = {$all:tagsArr}
            }
            if(isValid(subcategory)){
                const tagsArr = subcategory.trim().split(',').map(tags => tags.trim())
                filterQuery["tags"] = {$all:tagsArr}
            }
        }
            const blogs = await blogModel.find(filterQuery)
            if(Array.isArray(blogs) && blogs.length == 0){
                return res.status(400).send({status:false,mess:"blogs not found"})
            }
            return res.status(200).send({status:true, mess: "blog list", data: blogs})
    }catch(error){
        res.status(500).send({status:false,mess:error.message})
  }
}

// ### PUT /blogs/:blogId
// - Updates a blog by changing the its title, body, adding tags, adding a subcategory. (Assuming tag and subcategory received in body is need to be added)
// -i.e. adds publishedAt date Updates a blog by changing its publish status  and set published to true
// - Check if the blogId exists (must have isDeleted false). If it doesn't, return an HTTP status 404 with a response body like [this](#error-response-structure)
// - Return an HTTP status 200 if updated successfully with a body like [this](#successful-response-structure) 
// - Also make sure in the response you return the updated blog document. 

const Bloggs = async function (req, res) {
    try{
        const data = req.body
        const blogId = req.params.blogId
        const authorIdFromToken = req.authorId
        if(!isValidObjectId(blogId)){
            return res.status(400).send({status:false,mess:"please provide valid blogId"})
        }
        if(!isValidObjectId(authorIdFromToken)){
           return res.status(400).send({status:false,mess:"please provide valid authorIdFromToken"})
        }
        let blog = await blogModel.findOne({_id: blogId, isDeleted: false, deletedAt: null})
        if(!blog){
            return res.status(404).send({status:false,mess:"Blog not found"})
        }
        if(blog.authorId.toString() !== authorIdFromToken){
            return res.status(400).send({status:false,mess:"Unauthorised access"})
        }
        if(!validRequestBody(data)){
            return res.status(400).send({status:false,mess:"Please provide data to update"})
        }
        const updataBlog = {}
        if(isValid(title)){
            updataBlog["title"] = title
        }
        if(isValid(body)){
            updataBlog["body"] = body
        }
        if(isValid(category)){
            updataBlog["category"] = category
        }
        if(isValid(isPublished)){
            updataBlog["isPublished"] = isPublished
            updataBlog["pulishedAt"] = isPublished ? new Date() : null
        }
        if(tags){
            if(Array.isArray(tags)){
                updataBlog["tags"] = [...tags]
            }
        }
        if(subcategory){
            if(Array.isArray(tags)){
                updataBlog["sucategory"] = [...subcategory]
            }
        }
        const update = await blogModel.findOneAndUpdate({_id:blogId},updataBlog,{new:true})
        return res.status(200).send({status:true, mess: "blog updated successfully", data: update})
    }catch(error){
        res.status(500).send({status:false,mess:error.message})
  }
}

// ### DELETE /blogs/:blogId
// - Check if the blogId exists( and is not deleted). If it does, mark it deleted and return an HTTP status 200 without any response body.
// - If the blog document doesn't exist then return an HTTP status of 404 with a body like [this](#error-response-structure) 

const deleteblog = async function (req, res) {
    try{
        const blogId = req.params.blogId
        const authorIdFromToken = req.authorId
        if(!isValidObjectId(blogId)){
        return res.status(400).send({status:false,mess:"please provide valid blogId"})
        }
        if(!isValidObjectId(authorIdFromToken)){
        return res.status(400).send({status:false,mess:"please provide valid authorIdFromToken"})
        }
        let blog = await blogModel.findOne({_id: blogId, isDeleted: false, deletedAt: null})
        if(!blog){
            return res.status(404).send({status:false,mess:"Blog not found"})
        }
        if(blog.authorId.toString() !== authorIdFromToken){
            return res.status(400).send({status:false,mess:"Unauthorised access"})
        }
        await blogModel.findOneAndUpdate({_id:blogId},{$set:{isDeleted:true,deletedAt:new Date()}})
        return res.status(200).send({status:false,message:"Blog deleted successfully"})
    }catch(error){
        res.status(500).send({status:false,mess:error.message})
  }
}

// ### DELETE /blogs?queryParams
// - Delete blog documents by y, authorid, tag name, subcategory name, published=false
// - If the blog document doesn't exist then return an HTTP status of 404 with a body like [this](#error-response-structure)

const deleteByElement = async function (req, res) {
    try{
        const filterQuery = {isDeleted:false, deletedAt:null}
        const queryParams = req.query
        const authorIdFromToken = req.authorId
        if(!isValidObjectId(authorIdFromToken)){
            return res.status(400).send({status:false,mess:"please provide valid authorIdFromToken"})
        }
        if(!validRequestBody(queryParams)){
            return res.status(400).send({status:false,mess:"No query params received"})
        }
        const{authorId,category,tags,subcategory,isPublished} = queryParams
        if(isValid(authorId) && isValidObjectId(authorId)){
            filterQuery["authorId"] = authorId
        }
        if(isValid(category)){
            filterQuery["category"] = category
        }
        if(isValid(isPublished)){
            filterQuery["isPublished"] = isPublished
        }
        if(isValid(tags)){
            const sub = tags.trim().split(',').map(x => x.trim());
            filterQuery["tags"] = {$all: sub}
        }
        if(isValid(subcategory)){
            const sub = subcategory.trim().split(',').map(x => x.trim());
            filterQuery["sub"] = {$all: sub}
        }
        
        const blogs = await blogModel.find(filterQuery)
        if(Array.isArray(blogs) && blogs.length == 0){
            return res.status(404).send({status:false,mess:"No matching blog found"})
        }
        let blogsToDetete = blogs.map(blog => {
            if(blog.authorId.toString() == authorIdFromToken) return blog._id
        })
        await blogModel.updateMany({_id:{$in: blogsToDetete}}, {$set: {isDeleted:true, deletedAt: new Date()}})
        return res.status(200).send({status:true, mess:"Blogs deleted sucessfully"})
    }catch(error){
        res.status(500).send({status:false,mess:error.message})
  }
}


module.exports.createBlogger = createBlogger
module.exports.getBlogs = getBlogs
module.exports.Bloggs = Bloggs
module.exports.deleteblog = deleteblog
module.exports.deleteByElement = deleteByElement
