const express = require('express');
const router = express.Router();
const db = require('../config/database');
const adminAuth = require('../middleware/adminAuth');

// Get all employees
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        e.*,
        ja.Assignment_ID,
        ja.Start_Date as Assignment_Start_Date,
        ja.Status as Assignment_Status,
        ja.Assigned_Salary,
        j.Job_Title,
        j.Job_Code,
        d.Department_Name
      FROM EMPLOYEE e
      LEFT JOIN JOB_ASSIGNMENT ja ON e.Employee_ID = ja.Employee_ID AND ja.Status = 'Active'
      LEFT JOIN JOB j ON ja.Job_ID = j.Job_ID
      LEFT JOIN DEPARTMENT d ON j.Department_ID = d.Department_ID
      ORDER BY e.Employee_ID
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get employee by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM EMPLOYEE WHERE Employee_ID = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create employee
router.post('/', adminAuth, async (req, res) => {
  try {
    const {
      First_Name, Middle_Name, Last_Name, Arabic_Name, Gender, Nationality,
      DOB, Place_of_Birth, Marital_Status, Religion, Employment_Status,
      Mobile_Phone, Work_Phone, Work_Email, Personal_Email,
      Emergency_Contact_Name, Emergency_Contact_Phone, Emergency_Contact_Relationship,
      Residential_City, Residential_Area, Residential_Street, Residential_Country,
      Permanent_City, Permanent_Area, Permanent_Street, Permanent_Country
    } = req.body;

    const [result] = await db.query(`
      INSERT INTO EMPLOYEE (
        First_Name, Middle_Name, Last_Name, Arabic_Name, Gender, Nationality,
        DOB, Place_of_Birth, Marital_Status, Religion, Employment_Status,
        Mobile_Phone, Work_Phone, Work_Email, Personal_Email,
        Emergency_Contact_Name, Emergency_Contact_Phone, Emergency_Contact_Relationship,
        Residential_City, Residential_Area, Residential_Street, Residential_Country,
        Permanent_City, Permanent_Area, Permanent_Street, Permanent_Country
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      First_Name, Middle_Name, Last_Name, Arabic_Name, Gender, Nationality,
      DOB, Place_of_Birth, Marital_Status, Religion, Employment_Status,
      Mobile_Phone, Work_Phone, Work_Email, Personal_Email,
      Emergency_Contact_Name, Emergency_Contact_Phone, Emergency_Contact_Relationship,
      Residential_City, Residential_Area, Residential_Street, Residential_Country,
      Permanent_City, Permanent_Area, Permanent_Street, Permanent_Country
    ]);

    res.json({ id: result.insertId, message: 'Employee created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update employee
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const fields = [];
    const values = [];

    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(req.body[key]);
      }
    });

    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(req.params.id);
    const query = `UPDATE EMPLOYEE SET ${fields.join(', ')} WHERE Employee_ID = ?`;
    
    await db.query(query, values);
    res.json({ message: 'Employee updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get employee assignments
router.get('/:id/assignments', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        ja.*,
        j.Job_Title,
        j.Job_Code,
        c.Contract_Name,
        c.Type as Contract_Type,
        d.Department_Name
      FROM JOB_ASSIGNMENT ja
      JOIN JOB j ON ja.Job_ID = j.Job_ID
      JOIN CONTRACT c ON ja.Contract_ID = c.Contract_ID
      LEFT JOIN DEPARTMENT d ON j.Department_ID = d.Department_ID
      WHERE ja.Employee_ID = ?
      ORDER BY ja.Start_Date DESC
    `, [req.params.id]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get employee performance
router.get('/:id/performance', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        a.*,
        pc.Cycle_Name,
        pc.Cycle_Type,
        j.Job_Title
      FROM APPRAISAL a
      JOIN JOB_ASSIGNMENT ja ON a.Assignment_ID = ja.Assignment_ID
      JOIN PERFORMANCE_CYCLE pc ON a.Cycle_ID = pc.Cycle_ID
      JOIN JOB j ON ja.Job_ID = j.Job_ID
      WHERE ja.Employee_ID = ?
      ORDER BY a.Appraisal_Date DESC
    `, [req.params.id]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete employee
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM EMPLOYEE WHERE Employee_ID = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

