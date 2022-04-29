const mongoose = require("mongoose")
// var validateEmail = function(email) {
//     var re = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
//     return re.test(email)
// };

// const passwordComplexity = require("joi-password-complexity");
// const complexityOptions = {min: 4,max: 8,lowercase: true, uppercase:true, numeric: true,symbol: true, };
//  passwordComplexity().validate("<your_password>");

const authorSchema = new mongoose.Schema({

    // var validateEmail = function(email) {
    //     var re = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
    //     return re.test(email)
    // };


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


    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        validate: {
            validator: function(v) {
                return /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(v);
            },
            message: "Please enter a valid email"
        },
        required: [true, "Email required"]
    },

    password :{
        type : String,
        required : [true,"password is required"],
        trim : true

    }

    // "email": {
    //     type: String,
    //     // validate1:[isValidEmail,"enter valid email"]
    //     validate: {
    //         validator: function (v) {
    //             return /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(v);
    //         },
    //         message: "Please enter a valid email"
    //     },
    //     required: true, 
    //     unique: true,
    //     lowercase : true,
    //     trim: true
    // },


    // joi-password-complexity is build over joi
// npm i joi-password-complexity

//  passwordComplexity(complexityOptions).validate("<your_password>");
   


    // "email": {
    //     type: String,
    //     trim: true,
    //     lowercase: true,
    //     unique: true,
    //     required: true,
    //     validate: [validateEmail, 'Please fill a valid email address'],
    //     match: [/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/, 'Please fill a valid email address']
    // },


}, { timestamps: true })

module.exports = mongoose.model("author", authorSchema)



