const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all performance cycles
router.get('/cycles', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM PERFORMANCE_CYCLE ORDER BY Start_Date DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all appraisals
router.get('/appraisals', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        a.*,
        e.First_Name,
        e.Last_Name,
        j.Job_Title,
        pc.Cycle_Name,
        pc.Cycle_Type
      FROM APPRAISAL a
      JOIN JOB_ASSIGNMENT ja ON a.Assignment_ID = ja.Assignment_ID
      JOIN EMPLOYEE e ON ja.Employee_ID = e.Employee_ID
      JOIN JOB j ON ja.Job_ID = j.Job_ID
      JOIN PERFORMANCE_CYCLE pc ON a.Cycle_ID = pc.Cycle_ID
      ORDER BY a.Appraisal_Date DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get KPI scores
router.get('/kpi-scores', async (req, res) => {
  try {
    const { cycle_id, employee_id } = req.query;
    let query = `
      SELECT 
        eks.*,
        e.First_Name,
        e.Last_Name,
        ok.KPI_Name,
        ok.Target_Value,
        pc.Cycle_Name,
        j.Job_Title
      FROM EMPLOYEE_KPI_SCORE eks
      JOIN JOB_ASSIGNMENT ja ON eks.Assignment_ID = ja.Assignment_ID
      JOIN EMPLOYEE e ON ja.Employee_ID = e.Employee_ID
      JOIN OBJECTIVE_KPI ok ON eks.KPI_ID = ok.KPI_ID
      JOIN PERFORMANCE_CYCLE pc ON eks.Performance_Cycle_ID = pc.Cycle_ID
      JOIN JOB j ON ja.Job_ID = j.Job_ID
      WHERE 1=1
    `;
    const params = [];

    if (cycle_id) {
      query += ' AND eks.Performance_Cycle_ID = ?';
      params.push(cycle_id);
    }
    if (employee_id) {
      query += ' AND ja.Employee_ID = ?';
      params.push(employee_id);
    }

    query += ' ORDER BY eks.Review_Date DESC';

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create appraisal
router.post('/appraisals', async (req, res) => {
  try {
    const {
      Assignment_ID, Cycle_ID, Overall_Score, Manager_Comments, HR_Comments, Employee_Comments, Reviewer_ID
    } = req.body;

    const [result] = await db.query(`
      INSERT INTO APPRAISAL (
        Assignment_ID, Cycle_ID, Appraisal_Date, Overall_Score,
        Manager_Comments, HR_Comments, Employee_Comments, Reviewer_ID
      ) VALUES (?, ?, CURDATE(), ?, ?, ?, ?, ?)
    `, [Assignment_ID, Cycle_ID, Overall_Score, Manager_Comments, HR_Comments, Employee_Comments, Reviewer_ID]);

    res.json({ id: result.insertId, message: 'Appraisal created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get appeals
router.get('/appeals', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        ap.*,
        a.Overall_Score as Current_Score,
        e.First_Name,
        e.Last_Name
      FROM APPEAL ap
      JOIN APPRAISAL a ON ap.Appraisal_ID = a.Appraisal_ID
      JOIN JOB_ASSIGNMENT ja ON a.Assignment_ID = ja.Assignment_ID
      JOIN EMPLOYEE e ON ja.Employee_ID = e.Employee_ID
      ORDER BY ap.Submission_Date DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

