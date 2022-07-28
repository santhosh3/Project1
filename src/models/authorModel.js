const mongoose = require("mongoose")



const authorSchema = new mongoose.Schema({

  
    "fname": {
        type: String,
        required: [true, "firstName is required" ],
        trim: true
    },

    "lname": {
        type: String,
        required: [true, "lastName is required"],
        trim: true
    },

    "title": {
        type: String,
        required: [true, "title is required"],
        enum: ["Mr", "Mrs", "Miss","Mast"],
        trim: true
    },


    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        validate: {
            validator: function(email) {
                return /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email);
            },
            message: "Please enter a valid email"
        },
        required: [true, "Email address is required"]
    },
    password :{
        type : String,
        required : [true,"password is required"],
        trim : true,
        

    }


}, { timestamps: true })

module.exports = mongoose.model("author", authorSchema)



