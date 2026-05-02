const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phone:{
        type: String,
        required: true,
        validate:{
            validator: function (v) {
                return /^[0-9]{10}$/.test(v); //validate 10 digit phone number
            },
            message: "Invalid phone number format",
        },
    },
    email: {
        type: String,
        required: true,
        match: [/^\S+@\S+\.\S+$/, "Invalid email format"], //Basic email validation
    },
    serviceDescription: {
        type: String,
    },
    message:{
        type: String,
    },
},{ timestamps: true});

module.exports = mongoose.model('Registration', registrationSchema)