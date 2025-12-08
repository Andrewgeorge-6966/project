const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all departments
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        d.*,
        f.Faculty_Name,
        u.University_Name,
        COUNT(DISTINCT j.Job_ID) as Total_Jobs,
        COUNT(DISTINCT ja.Employee_ID) as Total_Employees
      FROM DEPARTMENT d
      LEFT JOIN FACULTY f ON d.Faculty_ID = f.Faculty_ID
      LEFT JOIN UNIVERSITY u ON f.University_ID = u.University_ID
      LEFT JOIN JOB j ON d.Department_ID = j.Department_ID
      LEFT JOIN JOB_ASSIGNMENT ja ON j.Job_ID = ja.Job_ID AND ja.Status = 'Active'
      GROUP BY d.Department_ID
      ORDER BY d.Department_Name
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all universities
router.get('/universities', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM UNIVERSITY ORDER BY University_Name');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all faculties
router.get('/faculties', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        f.*,
        u.University_Name
      FROM FACULTY f
      JOIN UNIVERSITY u ON f.University_ID = u.University_ID
      ORDER BY f.Faculty_Name
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get department by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        d.*,
        f.Faculty_Name,
        u.University_Name
      FROM DEPARTMENT d
      LEFT JOIN FACULTY f ON d.Faculty_ID = f.Faculty_ID
      LEFT JOIN UNIVERSITY u ON f.University_ID = u.University_ID
      WHERE d.Department_ID = ?
    `, [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Department not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

