const express = require('express');
const Hospital = require('../models/hospital');
const router = express.Router();


router.get('/', (req, res) => {
    res.status(200).send('Welcome to Hospital APIs');
});


router.get('/hospitals', async (req, res) => {
    try {
        const hospitals = await Hospital.find();
        res.status(200).json(hospitals);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong. Please try again later.' });
    }
});


router.get('/hospitals/:id', async (req, res) => {
    try {
        const hospital = await Hospital.findById(req.params.id);
        if (!hospital) return res.status(404).json({ message: 'Hospital not found' });
        res.status(200).json(hospital);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong. Please try again later.' });
    }
});


router.post('/hospitals', async (req, res) => {
    try {
        const { name, city, totalBeds, availableBeds } = req.body;
        if (!name) return res.status(400).json({ message: 'Name is required' });
        if (!city) return res.status(400).json({ message: 'City is required' });

        const hospital = new Hospital({ name, city, totalBeds: totalBeds || 0, availableBeds: availableBeds || 0 });
        await hospital.save();
        res.status(201).json(hospital);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong. Please try again later.' });
    }
});


router.put('/hospitals/:id', async (req, res) => {
    try {
        const hospital = await Hospital.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!hospital) return res.status(404).json({ message: 'Hospital not found' });
        res.status(200).json(hospital);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong. Please try again later.' });
    }
});


router.delete('/hospitals/:id', async (req, res) => {
    try {
        const hospital = await Hospital.findByIdAndDelete(req.params.id);
        if (!hospital) return res.status(404).json({ message: 'Hospital not found' });
        res.status(200).json({ message: 'Hospital deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong. Please try again later.' });
    }
});

module.exports = router;