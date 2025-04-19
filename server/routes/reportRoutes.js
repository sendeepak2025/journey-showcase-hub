const express = require('express');
const router = express.Router();
const Report = require('../models/Reports');

// POST new report
// POST new report
router.post('/', async (req, res) => {
  console.log('POST request received at /api/reports');
  console.log('Request body:', req.body); // Logs the body of the incoming request
  try {
    const report = new Report(req.body);
    await report.save();
    res.status(201).json(report);
  } catch (error) {
    console.error('Error creating report:', error); // Logs the error
    res.status(400).json({ message: error.message });
  }
});


// GET all reports
router.get('/', async (req, res) => {
  try {
    const reports = await Report.find();
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single report by ID
router.get('/:id', async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }
    
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
