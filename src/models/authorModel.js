const mongoose = require("mongoose")

const authorSchema = new mongoose.Schema({


    "firstName": {
        type: String,
        required: [true, "firstName is required" ],
        trim: true
    },

    "lastName": {
        type: String,
        required: [true, "lastName is required"],
        trim: true
    },

    "title": {
        type: String,
        required: [true, "title is required"],
        enum: ["Mr", "Mrs", "Miss"],
        trim: true
    },

    "email": {
        type: String,
        // validate1:[isValidEmail,"enter valid email"]
        validate: {
            validator: function (v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: "Please enter a valid email"
        },
        required: true, 
        unique: true,
        lowercase : true,
        trim: true
    },

    "password": {
        type: String,
        required: [true,"password is required"],
        trim: true
    }

}, { timestamps: true })

module.exports = mongoose.model("author", authorSchema)