const express = require('express');
const router = express.Router();
const Registration = require('../models/registration');
const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;
const adminPhone = process.env.ADMIN_PHONE_NUMBER;

const client = new twilio(accountSid, authToken);

//POst: Add new registration
// POST route to save form data
router.post("/", async (req, res) => {
    try {
        console.log("Received data:", req.body); // Log the request body

        const newRegistration = new Registration(req.body);
        const savedRegistration = await newRegistration.save();
        
        // Send SMS
        const { name, phone, email, serviceDescription, message } = req.body;
        const smsMessage = `New Registration:\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\nService: ${serviceDescription}\nMessage: ${message}`;
        
        try {
            await client.messages.create({
                body: smsMessage,
                from: twilioPhone,
                to: adminPhone
            });
            console.log("SMS Sent for Registration");
        } catch (smsError) {
            console.error("Error sending SMS:", smsError);
            // We still want to return 201 since registration was saved
        }

        res.status(201).json(savedRegistration);
    } catch (error) {
        console.error("Error saving registration:", error);
        res.status(400).json({ message: error.message });
    }
});

// GET: Retrive all registrations 

router.get('/', async (req, res)=> {
    try {
        const registrations = await Registration.find();
        res.status(200).json({ success: true, data: registrations });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message});
    }
});

module.exports = router;
