const express = require('express');
const mongoose = require('mongoose');
const { mongoDb } = require('./db');
const calculationSchema = require('./models/Calculation');

const Calculation = mongoDb.model('Calculation', calculationSchema);

const router = express.Router();

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
    
    if (!expression || result === undefined) {
      return res.status(400).json({ error: 'Expression and result are required' });
    }

    const newCalculation = new Calculation({
      expression,
      result,
    });

    const savedCalculation = await newCalculation.save();
    res.status(201).json(savedCalculation);
  } catch (error) {
    console.error('Error saving calculation:', error);
    res.status(500).json({ error: 'Failed to save calculation' });
  }
});

// GET /api/calculations - Retrieve calculation history
router.get('/calculations', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const calculations = await Calculation.find()
      .sort({ createdAt: -1 })
      .limit(limit);
    res.json(calculations);
  } catch (error) {
    console.error('Error retrieving calculations:', error);
    res.status(500).json({ error: 'Failed to retrieve calculations' });
  }
});

module.exports = router;
