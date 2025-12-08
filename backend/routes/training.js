const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all training programs
router.get('/programs', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        tp.*,
        COUNT(DISTINCT et.Employee_ID) as Enrolled_Count,
        COUNT(DISTINCT CASE WHEN et.Completion_Status = 'Completed' THEN et.ET_ID END) as Completed_Count
      FROM TRAINING_PROGRAM tp
      LEFT JOIN EMPLOYEE_TRAINING et ON tp.Program_ID = et.Program_ID
      GROUP BY tp.Program_ID
      ORDER BY tp.Program_ID
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get employee training records
router.get('/employees/:id', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        et.*,
        tp.Title,
        tp.Program_Code,
        tp.Type,
        tp.Delivery_Method,
        tc.certificate_file_path,
        tc.Issue_Date as Certificate_Issue_Date
      FROM EMPLOYEE_TRAINING et
      JOIN TRAINING_PROGRAM tp ON et.Program_ID = tp.Program_ID
      LEFT JOIN TRAINING_CERTIFICATE tc ON et.ET_ID = tc.ET_ID
      WHERE et.Employee_ID = ?
      ORDER BY et.ET_ID DESC
    `, [req.params.id]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Enroll employee in training
router.post('/enroll', async (req, res) => {
  try {
    const { Employee_ID, Program_ID, Completion_Status } = req.body;
    
    const [result] = await db.query(`
      INSERT INTO EMPLOYEE_TRAINING (Employee_ID, Program_ID, Completion_Status)
      VALUES (?, ?, ?)
    `, [Employee_ID, Program_ID, Completion_Status || 'Pending']);

    res.json({ id: result.insertId, message: 'Employee enrolled successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create training program
router.post('/programs', async (req, res) => {
  try {
    const {
      Program_Code, Title, Objectives, Type, Subtype, Delivery_Method, Approval_Status
    } = req.body;

    const [result] = await db.query(`
      INSERT INTO TRAINING_PROGRAM (
        Program_Code, Title, Objectives, Type, Subtype, Delivery_Method, Approval_Status
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [Program_Code, Title, Objectives, Type, Subtype, Delivery_Method, Approval_Status || 'Pending']);

    res.json({ id: result.insertId, message: 'Training program created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

