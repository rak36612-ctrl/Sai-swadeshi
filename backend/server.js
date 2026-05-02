const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const connectDB = require('./config/db');
const registrationRoutes = require('./routes/registrationRoute');
const Contact = require('./models/contact');
const twilio = require("twilio");

//connect to database

connectDB();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;
const adminPhone = process.env.ADMIN_PHONE_NUMBER;  // Admin's mobile number

const app = express();
const PORT = process.env.PORT || 5000;

//middleWare
// Middleware
app.use(cors());
app.use(express.json()); // Ensure this is present
app.use(bodyParser.urlencoded({ extended: true }));

//Routes
app.use("/api/registration", registrationRoutes);


const client = new twilio(accountSid, authToken);

// Base Route
app.get('/', (req, res) => {
    res.send('API is running...');
});

//contact
// Define Schema


// const Contact = mongoose.model("Contact", Contact);

// Google reCAPTCHA Secret Key
// const RECAPTCHA_SECRET = "6LcgGfQqAAAAAEGweZk9hCrgEcTy569DbeXYmlOl";

// // Verify Google reCAPTCHA
// async function verifyRecaptcha(token) {
//     const response = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET}&response=${token}`, {
//         method: "POST",
//     });

//     const data = await response.json();
//     return data.success;
// }

// Handle Contact Form Submission
app.post("/api/contact", async (req, res) => {
    const { name, phone, email, message } = req.body;

    const newContact = new Contact({ name, phone, email, message });

    try {
        await newContact.save();
        
        // Send SMS Notification
        const smsBody = `New Contact Form Submission:\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\nMessage: ${message}`;
        await client.messages.create({
            body: smsBody,
            from: twilioPhone,
            to: adminPhone
        });

        res.status(200).json({ message: "Form submitted successfully" });
    } catch (error) {
        console.error("Error in contact route:", error);
        res.status(500).json({ error: "Failed to save data or send SMS" });
    }
});

//start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});