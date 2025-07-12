const express = require('express');

const router = express.Router();

// In-memory storage for calculations (temporary, will be lost on server restart)
let calculations = [];

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

// POST /api/calculations - Save a new calculation (in-memory)
router.post('/calculations', (req, res) => {
  try {
    const { expression, result } = req.body;
    if (!expression || !result) {
      return res.status(400).json({ message: 'Expression and result are required' });
    }

    const newCalculation = {
      expression,
      result,
      timestamp: new Date().toISOString(),
      id: calculations.length + 1
    };

    calculations.push(newCalculation);
    res.status(201).json(newCalculation);
  } catch (error) {
    console.error('Error saving calculation:', error);
    res.status(500).json({ message: 'Failed to save calculation' });
  }
});

// GET /api/calculations - Retrieve calculation history (from memory)
router.get('/calculations', (req, res) => {
  try {
    // Return the last 10 calculations, sorted by timestamp descending
    const sortedCalculations = calculations
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 10);
    res.json(sortedCalculations);
  } catch (error) {
    console.error('Error fetching calculations:', error);
    res.status(500).json({ message: 'Failed to fetch calculation history' });
  }
});

module.exports = router;
