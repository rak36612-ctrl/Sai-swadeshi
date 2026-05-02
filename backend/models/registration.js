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

const Registration = mongoose.model('Registration', registrationSchema);

// Try to drop the old unique index on email if it exists, so database stops throwing 11000 errors
Registration.collection.dropIndex('email_1').catch(err => {
    // Ignore error if index doesn't exist
});

module.exports = Registration;