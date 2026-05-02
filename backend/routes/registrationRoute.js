const express = require('express');
const router = express.Router();
const Registration = require('../models/registration');

//POst: Add new registration
// POST route to save form data
router.post("/", async (req, res) => {
    try {
        console.log("Received data:", req.body); // Log the request body

        const newRegistration = new Registration(req.body);
        const savedRegistration = await newRegistration.save();
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
