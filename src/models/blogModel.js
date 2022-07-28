const mongoose = require("mongoose")
const moment = require("moment")
const ObjectId = mongoose.Schema.Types.ObjectId


let date = moment().format('DD/MM/YYYY');
console.log(date)


const blogSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        trim : true,
    },
    body: {
        type: String,
        required: true,
        trim : true
    },
    authorId: {
        type: ObjectId,
        ref: "author",
        required :true
    },
    tags: [{type : String, trim: true}],
    category: {
        type: String,
        required: true,
        trim: true
    },
    subcategory: [{type : String, trim : true}],
    isPublished: {
        type: Boolean,
        default: false
    },
    // publishedAt:  {
    //     type: Date,
    //     default: null
    // },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type : Date,
      default : null
    }, 

}, { timestamps: true })

module.exports = mongoose.model("blog", blogSchema)