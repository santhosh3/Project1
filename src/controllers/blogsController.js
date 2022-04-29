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
// - Return the HTTP status 200 if any documents are found. The response structure should be like [this](#successful-response-structure) 
// - If no documents are found then return an HTTP status 404 with a response like [this](#error-response-structure) 
 
// - Filter blogs list by applying filters. Query param can have any combination of below filters.
//   - By author Id
//   - By category
//   - List of blogs that have a specific tag
//   - List of blogs that have a specific subcategory
// example of a query url: blogs?filtername=filtervalue&f2=fv2







// const upData = async (req, res) => {
//     try {
//         let blogId = req.params.blogId;
//         if (!blogId) return res.status(404).send({ msg: "blogId is compulsory" })
//         let user = await blogModel.findById(blogId);
//         if (!user) {
//             return res.send("No such user exists");
//         }
//         let data = req.body
//         // let updatedData = await blogModel.findOneAndUpdate({ _id: userId },{$set : {title : data.title,body : data.body, tags :["small"]}}) 
//         if (Object.keys(data).length != 0) {
//             let updatedData = await blogModel.findOneAndUpdate({ _id: blogId }, data, { new: true })
//             res.send({ status: true, data: updatedData })
//         } else {
//             res.status(400).send({ msg: "Bad Request" })
//         }
//     }
//     catch (err) {
//         console.log(err)
//         res.status(500).send({ msg: "error" })
//     }

// }

// const status = async (req, res) => {
//     try {
//         let blogId = req.params.blogId;
//         if (!blogId) return res.status(404).send({ msg: "userId is compulsory" })
//         let user = await blogModel.findById(blogId);
//         if (!user) {
//             return res.send("No such user exists");
//         }
//         let isPublished = await blogModel.findOne({ _id: blogId, isPublished: true })
//         if (!isPublished) {
//             return res.status(404).send("ispublished must be true")
//         }
//         var CurrentDate = moment().format("YYYY-MM-DD hh:mm:ss");
//         let updatedData = await blogModel.findOneAndUpdate({ _id: blogId }, { $set: { CurrentDate } }, { new: true, upsert: true });


//         res.status(200).send({ status: true, data: updatedData })
//     }
//     catch (err) {
//         console.log(err)
//         res.status(500).send
//     }
// }

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

    // Updates a blog by changing the its title, body, adding tags, adding a subcategory. (Assuming tag and subcategory received in body is need to be added)
    // -i.e. adds publishedAt date Updates a blog by changing its publish status  and set published to true
    // - Check if the blogId exists (must have isDeleted false). 
    // - Also make sure in the response you return the updated blog document.

    // const updateBlog = async (req, res) => {
    //     try{
    //       let getBlogId = req.params.blogId; //getting the blogId from the request params
    //       if(!getBlogId) return res.status(400).send({ status: false, msg: "Please enter a Blog Id" });
      
    //       //validating the blogId to check whether it is valid or not
    //       if(!isValidObjectId(getBlogId)) return res.status(404).send({ status: false, msg: "Enter a valid blog Id" })
      
    //       let findBlogId = await Blog.findById(getBlogId);//finding the blogId in the database to check whether it is valid or not
    //       if(!findBlogId) return res.status(404).send({ status: false, msg: "No such blog exist" });
      
    //       //Verify that the document is deleted or not
    //       if(findBlogId.isDeleted) return res.status(404).send({ status: false, msg: "No such blog found or has already been deleted" });
      
    //       let {...data} = req.body; //destructuring the data from the request body
          
    //       //validating the data for empty values
    //       if(Object.keys(data).length == 0) return res.status(400).send({ status: false, msg: "Data is required to update a Blog" });
      
    //       //checking that the below data has the attributes provided inside hasOwnProperty()
    //       if(data.hasOwnProperty('isDeleted') || data.hasOwnProperty('authorId') || data.hasOwnProperty('deletedAt') || data.hasOwnProperty('publishedAt')) return res.status(403).send({ status: false, msg: "Action is Forbidden" });
      
    //       //checking that the below data has the attributes provided inside hasOwnProperty()
    //       if(data.hasOwnProperty('title')){
    //         let {...tempData} = data;
    //         delete(tempData.title); //deleting the title from the data
    //         let getValues = Object.values(tempData) //getting the values from the data object
    //         if(validString.test(getValues)) return res.status(400).send({ status: false, msg: "Data should not contain numbers" })
    //       }else{
    //         let getValues = Object.values(data) //getting the values from the data object
    //         if(validString.test(getValues)) return res.status(400).send({ status: false, msg: "Data should not contain numbers" })
    //       }
    //       //Updating the blog data in the database based on the blogId and the data provided in the request body
    //       let updatedBlog = await Blog.findByIdAndUpdate(
    //         {_id: getBlogId},
    //         {
    //           $push: [ {tags: {$each: data.tags}}, {category: {$each: data.category}}, {subcategory: {$each: data.subcategory}} ],
    //           title: data.title,
    //           body: data.body,
    //           isPublished: data.isPublished,
    //         },
    //         {new: true}
    //       )
      
    //       if((!findBlogId.isPublished) && updatedBlog.isPublished){ 
    //         let timeStamps = new Date(); //getting the current timeStamps
    //         let updateData = await Blog.findOneAndUpdate(
    //           {_id: getBlogId}, //finding the blogId in the database to update the publishedAt
    //           {publishedAt: timeStamps}, //updating the publishedAt
    //           {new: true} //returning the updated data
    //         )
    //         return res.status(200).send({ status: true, data: updateData });
    //       } 
      
    //       res.status(200).send({ status: true, data: updatedBlog });
    //     } catch (err) {
    //       res.status(500).send({ status: false, error: err.message });
    //     }
    //   };






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




// module.exports = {  createBlogger,  Bloggs , deleteblog  ,  deleteByElement }  
module.exports.createBlogger = createBlogger
// module.exports.getBlogsData = getBlogsData
module.exports.getBlogs = getBlogs
// module.exports.upData = upData
module.exports.Bloggs = Bloggs
module.exports.deleteblog = deleteblog
module.exports.deleteByElement = deleteByElement
