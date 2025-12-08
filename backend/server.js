const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
const employeeRoutes = require('./routes/employees');
const jobRoutes = require('./routes/jobs');
const departmentRoutes = require('./routes/departments');
const performanceRoutes = require('./routes/performance');
const trainingRoutes = require('./routes/training');
const dashboardRoutes = require('./routes/dashboard');

app.use('/api/employees', employeeRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/performance', performanceRoutes);
app.use('/api/training', trainingRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'HR Management System API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

