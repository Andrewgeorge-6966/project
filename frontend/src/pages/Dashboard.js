import React, { useState, useEffect } from 'react';
import api from '../config/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [genderData, setGenderData] = useState([]);
  const [deptData, setDeptData] = useState([]);
  const [recentAppraisals, setRecentAppraisals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, genderRes, deptRes, appraisalsRes] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/dashboard/gender-distribution'),
        api.get('/dashboard/department-employees'),
        api.get('/dashboard/recent-appraisals'),
      ]);

      setStats(statsRes.data);
      setGenderData(genderRes.data);
      setDeptData(deptRes.data);
      setRecentAppraisals(appraisalsRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe'];

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div>
      <h1 style={{ marginBottom: '30px', color: '#333' }}>Dashboard</h1>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats?.totalEmployees || 0}</div>
          <div className="stat-label">Total Employees</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats?.activeEmployees || 0}</div>
          <div className="stat-label">Active Employees</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats?.totalJobs || 0}</div>
          <div className="stat-label">Total Jobs</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats?.activeAssignments || 0}</div>
          <div className="stat-label">Active Assignments</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats?.totalDepartments || 0}</div>
          <div className="stat-label">Departments</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats?.totalTrainingPrograms || 0}</div>
          <div className="stat-label">Training Programs</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {stats?.averageAppraisalScore 
              ? parseFloat(stats.averageAppraisalScore).toFixed(1) 
              : 0}
          </div>
          <div className="stat-label">Avg Appraisal Score</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-2" style={{ marginBottom: '30px' }}>
        <div className="card">
          <h3 className="card-title">Gender Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={genderData}
                dataKey="count"
                nameKey="Gender"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {genderData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="card-title">Employees by Department</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={deptData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="Department_Name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="employee_count" fill="#667eea" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Appraisals */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Recent Appraisals</h3>
          <Link to="/performance" className="btn btn-primary">View All</Link>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Job Title</th>
                <th>Cycle</th>
                <th>Score</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentAppraisals.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>No appraisals found</td>
                </tr>
              ) : (
                recentAppraisals.map((appraisal) => (
                  <tr key={appraisal.Appraisal_ID}>
                    <td>{appraisal.Employee_Name}</td>
                    <td>{appraisal.Job_Title}</td>
                    <td>{appraisal.Cycle_Name}</td>
                    <td>
                      <span className={`badge ${
                        appraisal.Overall_Score >= 90 ? 'badge-success' :
                        appraisal.Overall_Score >= 70 ? 'badge-info' :
                        'badge-warning'
                      }`}>
                        {appraisal.Overall_Score}
                      </span>
                    </td>
                    <td>{new Date(appraisal.Appraisal_Date).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

