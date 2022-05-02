const mongoose = require("mongoose")



const authorSchema = new mongoose.Schema({

  
    "fName": {
        type: String,
        required: [true, "firstName is required" ],
        trim: true
    },

    "lName": {
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
        validate: {
            validator: function(p) {
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/.test(p)
            },
            message: "Please enter a valid password : It must contains atleast{ one Uppercase , one Lowercase, one special character and one number}"
        },
        required : [true,"password is required"],
        trim : true,
        

    }


}, { timestamps: true })

module.exports = mongoose.model("author", authorSchema)



