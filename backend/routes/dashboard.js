const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = {};

    // Total employees
    const [employees] = await db.query('SELECT COUNT(*) as total FROM EMPLOYEE');
    stats.totalEmployees = employees[0].total;

    // Active employees
    const [active] = await db.query("SELECT COUNT(*) as total FROM EMPLOYEE WHERE Employment_Status = 'Active'");
    stats.activeEmployees = active[0].total;

    // Total jobs
    const [jobs] = await db.query('SELECT COUNT(*) as total FROM JOB');
    stats.totalJobs = jobs[0].total;

    // Active assignments
    const [assignments] = await db.query("SELECT COUNT(*) as total FROM JOB_ASSIGNMENT WHERE Status = 'Active'");
    stats.activeAssignments = assignments[0].total;

    // Total departments
    const [departments] = await db.query('SELECT COUNT(*) as total FROM DEPARTMENT');
    stats.totalDepartments = departments[0].total;

    // Training programs
    const [training] = await db.query('SELECT COUNT(*) as total FROM TRAINING_PROGRAM');
    stats.totalTrainingPrograms = training[0].total;

    // Average appraisal score
    const [avgScore] = await db.query('SELECT AVG(Overall_Score) as avg FROM APPRAISAL');
    stats.averageAppraisalScore = avgScore[0].avg || 0;

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get gender distribution
router.get('/gender-distribution', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT Gender, COUNT(*) as count
      FROM EMPLOYEE
      WHERE Gender IS NOT NULL
      GROUP BY Gender
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get department employee count
router.get('/department-employees', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        d.Department_Name,
        COUNT(DISTINCT ja.Employee_ID) as employee_count
      FROM DEPARTMENT d
      LEFT JOIN JOB j ON d.Department_ID = j.Department_ID
      LEFT JOIN JOB_ASSIGNMENT ja ON j.Job_ID = ja.Job_ID AND ja.Status = 'Active'
      GROUP BY d.Department_ID, d.Department_Name
      ORDER BY employee_count DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get recent appraisals
router.get('/recent-appraisals', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        a.Appraisal_ID,
        CONCAT(e.First_Name, ' ', e.Last_Name) as Employee_Name,
        j.Job_Title,
        a.Overall_Score,
        a.Appraisal_Date,
        pc.Cycle_Name
      FROM APPRAISAL a
      JOIN JOB_ASSIGNMENT ja ON a.Assignment_ID = ja.Assignment_ID
      JOIN EMPLOYEE e ON ja.Employee_ID = e.Employee_ID
      JOIN JOB j ON ja.Job_ID = j.Job_ID
      JOIN PERFORMANCE_CYCLE pc ON a.Cycle_ID = pc.Cycle_ID
      ORDER BY a.Appraisal_Date DESC
      LIMIT 10
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

