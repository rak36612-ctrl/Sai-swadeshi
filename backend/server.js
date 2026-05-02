const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const registrationRoutes = require('./routes/registrationRoute');
const Contact = require('./models/contact');
dotenv.config();
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


//Base Route
app.get('/', (req, res) => {
    res.send('API is running...');
    console.log();
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
app.post("/contact", async (req, res) => {
    const { name, phone, email, message, recaptchaResponse } = req.body;

    // if (!recaptchaResponse) {
    //     return res.status(400).json({ error: "reCAPTCHA verification failed" });
    // }

    // const isHuman = await verifyRecaptcha(recaptchaResponse);
    // if (!isHuman) {
    //     return res.status(400).json({ error: "reCAPTCHA verification failed" });
    // }

    const newContact = new Contact({ name, phone, email, message });

    try {
        await newContact.save();
        res.status(200).json({ message: "Form submitted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to save data" });
    }
});

const client = new twilio(accountSid, authToken);

app.post("/send-sms", (req, res) => {
    const { fullName, phone, email, serviceDescription, message } = req.body;
    
    const smsMessage = `New Registration:\n
    Name: ${fullName}\n
    Phone: ${phone}\n
    Email: ${email}\n
    Service: ${serviceDescription}\n
    Message: ${message}`;

    client.messages
        .create({
            body: smsMessage,
            from: twilioPhone,
            to: adminPhone
        })
        .then(message => {
            console.log("SMS Sent: " + message.sid);
            res.status(200).json({ success: true, msg: "SMS Sent" });
        })
        .catch(err => {
            console.error("Error sending SMS: ", err);
            res.status(500).json({ success: false, msg: "Error sending SMS" });
        });
});

// Handle Contact Form Submission
app.post("/api/contact", async (req, res) => {
    const { name, phone, email, message, recaptchaResponse } = req.body;

    // Verify reCAPTCHA
    // const secretKey = "6LffKfQqAAAAAPpKn11NkHtYBgP7tGlACkuZS0IE";
    // const recaptchaURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaResponse}`;

    // const recaptchaRes = await fetch(recaptchaURL, { method: "POST" });
    // const recaptchaData = await recaptchaRes.json();

    // if (!recaptchaData.success) {
    //     return res.status(400).json({ error: "reCAPTCHA verification failed" });
    // }

    // Send SMS Notification
    const smsBody = `New Contact Form Submission:\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\nMessage: ${message}`;
    
    try {
        await client.messages.create({
            body: smsBody,
            from: twilioPhone,
            to: adminPhone
        });

        res.json({ message: "Message sent successfully!" });
    } catch (error) {
        console.error("Error sending SMS:", error);
        res.status(500).json({ error: "Failed to send SMS" });
    }
});

app.post('/api/registration', (req, res) => {
    console.log(req.body); // Check what data is received
});


//start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});