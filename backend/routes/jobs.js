const express = require('express');
const router = express.Router();
const db = require('../config/database');
const adminAuth = require('../middleware/adminAuth');

// Get all jobs
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        j.*,
        d.Department_Name,
        f.Faculty_Name,
        u.University_Name,
        COUNT(ja.Assignment_ID) as Active_Assignments
      FROM JOB j
      LEFT JOIN DEPARTMENT d ON j.Department_ID = d.Department_ID
      LEFT JOIN FACULTY f ON d.Faculty_ID = f.Faculty_ID
      LEFT JOIN UNIVERSITY u ON f.University_ID = u.University_ID
      LEFT JOIN JOB_ASSIGNMENT ja ON j.Job_ID = ja.Job_ID AND ja.Status = 'Active'
      GROUP BY j.Job_ID
      ORDER BY j.Job_ID
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get job by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        j.*,
        d.Department_Name,
        f.Faculty_Name,
        u.University_Name
      FROM JOB j
      LEFT JOIN DEPARTMENT d ON j.Department_ID = d.Department_ID
      LEFT JOIN FACULTY f ON d.Faculty_ID = f.Faculty_ID
      LEFT JOIN UNIVERSITY u ON f.University_ID = u.University_ID
      WHERE j.Job_ID = ?
    `, [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Get job objectives and KPIs
    const [objectives] = await db.query(`
      SELECT 
        jo.*,
        GROUP_CONCAT(
          CONCAT(ok.KPI_ID, ':', ok.KPI_Name, ':', ok.Target_Value, ':', ok.Weight)
          SEPARATOR '||'
        ) as KPIs
      FROM JOB_OBJECTIVE jo
      LEFT JOIN OBJECTIVE_KPI ok ON jo.Objective_ID = ok.Objective_ID
      WHERE jo.Job_ID = ?
      GROUP BY jo.Objective_ID
    `, [req.params.id]);

    res.json({ ...rows[0], objectives });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create job
router.post('/', adminAuth, async (req, res) => {
  try {
    const {
      Job_Code, Job_Title, Job_Level, Job_Category, Job_Grade,
      Min_Salary, Max_Salary, Job_Description, Status, Department_ID, Reports_To
    } = req.body;

    const [result] = await db.query(`
      INSERT INTO JOB (
        Job_Code, Job_Title, Job_Level, Job_Category, Job_Grade,
        Min_Salary, Max_Salary, Job_Description, Status, Department_ID, Reports_To
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      Job_Code, Job_Title, Job_Level, Job_Category, Job_Grade,
      Min_Salary, Max_Salary, Job_Description, Status, Department_ID, Reports_To
    ]);

    res.json({ id: result.insertId, message: 'Job created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update job
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const fields = [];
    const values = [];

    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined && key !== 'Job_ID') {
        fields.push(`${key} = ?`);
        values.push(req.body[key]);
      }
    });

    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(req.params.id);
    const query = `UPDATE JOB SET ${fields.join(', ')} WHERE Job_ID = ?`;
    
    await db.query(query, values);
    res.json({ message: 'Job updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get job assignments
router.get('/:id/assignments', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        ja.*,
        e.First_Name,
        e.Last_Name,
        e.Work_Email,
        c.Contract_Name
      FROM JOB_ASSIGNMENT ja
      JOIN EMPLOYEE e ON ja.Employee_ID = e.Employee_ID
      JOIN CONTRACT c ON ja.Contract_ID = c.Contract_ID
      WHERE ja.Job_ID = ?
      ORDER BY ja.Start_Date DESC
    `, [req.params.id]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete job
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM JOB WHERE Job_ID = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

