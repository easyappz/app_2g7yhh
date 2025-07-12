const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

// Define the Calculation Schema
const CalculationSchema = new mongoose.Schema({
  expression: { type: String, required: true },
  result: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Calculation = mongoose.model('Calculation', CalculationSchema);

// GET /api/hello
router.get('/hello', (req, res) => {
  res.json({ message: 'Hello from API!' });
});

// GET /api/status
router.get('/status', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// POST /api/calculations - Save a new calculation
router.post('/calculations', async (req, res) => {
  try {
    const { expression, result } = req.body;
    if (!expression || !result) {
      return res.status(400).json({ message: 'Expression and result are required' });
    }

    const newCalculation = new Calculation({
      expression,
      result,
    });

    const savedCalculation = await newCalculation.save();
    res.status(201).json(savedCalculation);
  } catch (error) {
    console.error('Error saving calculation:', error);
    res.status(500).json({ message: 'Failed to save calculation' });
  }
});

// GET /api/calculations - Retrieve calculation history
router.get('/calculations', async (req, res) => {
  try {
    const calculations = await Calculation.find().sort({ timestamp: -1 }).limit(10);
    res.json(calculations);
  } catch (error) {
    console.error('Error fetching calculations:', error);
    res.status(500).json({ message: 'Failed to fetch calculation history' });
  }
});

module.exports = router;
