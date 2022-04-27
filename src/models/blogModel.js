const mongoose = require("mongoose")
const moment = require("moment")
// const { required } = require("nodemon/lib/config")
const ObjectId = mongoose.Schema.Types.ObjectId
// const date = new Date();
// const todayDate = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`


let date = moment().format('DD/MM/YYYY');
console.log(date)


const blogSchema = new mongoose.Schema({

    "title": {
        type: String,
        required: [true,"title is required"],
        trim : true,
    },


    "body": {
        type: String,
        required: true,
        trim : true
    },


    "authorId": {
        type: ObjectId,
        ref: "author",
        required : true
    },


    "tags": [{type : String}],
    "category": {
        type: String,
        required: true
        // examples :[technology,entertainment,life style,food,fashion]
    },



    "subcategory": [{type : String}],
    "isPublished": {
        type: Boolean,
        default: false
    },


    "publishedAt": Date, // if published is true publishedAt will have a date 2021-09-17T04:25:07.803Z
    date : {
        type : String,
      default : date
    },


    "deleted": {
        type: Boolean,
        default: false
    },

    
    "deletedAt": Date, // if deleted is true deletedAt will have a date 2021-09-17T04:25:07.803Z,

}, { timestamps: true })

module.exports = mongoose.model("blog", blogSchema)