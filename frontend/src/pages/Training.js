import React, { useState, useEffect } from 'react';
import api from '../config/api';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const Training = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const response = await api.get('/training/programs');
      setPrograms(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching training programs:', error);
      setLoading(false);
    }
  };

  const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b'];

  // Prepare completion data
  const completionData = programs.map(program => ({
    name: program.Title,
    value: program.Completed_Count || 0,
    enrolled: program.Enrolled_Count || 0,
  }));

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div>
      <h1 style={{ marginBottom: '30px', color: '#333' }}>Training Management</h1>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{programs.length}</div>
          <div className="stat-label">Total Programs</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {programs.reduce((sum, p) => sum + (p.Enrolled_Count || 0), 0)}
          </div>
          <div className="stat-label">Total Enrollments</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {programs.reduce((sum, p) => sum + (p.Completed_Count || 0), 0)}
          </div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {programs.filter(p => p.Approval_Status === 'Approved').length}
          </div>
          <div className="stat-label">Approved Programs</div>
        </div>
      </div>

      {/* Chart */}
      <div className="card">
        <h3 className="card-title">Training Completion by Program</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={completionData.filter(d => d.value > 0)}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {completionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Training Programs */}
      <div className="card">
        <h3 className="card-title">Training Programs</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Title</th>
                <th>Type</th>
                <th>Subtype</th>
                <th>Delivery Method</th>
                <th>Status</th>
                <th>Enrolled</th>
                <th>Completed</th>
              </tr>
            </thead>
            <tbody>
              {programs.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center' }}>No training programs found</td>
                </tr>
              ) : (
                programs.map((program) => (
                  <tr key={program.Program_ID}>
                    <td>{program.Program_Code}</td>
                    <td>{program.Title}</td>
                    <td>{program.Type || '-'}</td>
                    <td>{program.Subtype || '-'}</td>
                    <td>{program.Delivery_Method || '-'}</td>
                    <td>
                      <span className={`badge ${
                        program.Approval_Status === 'Approved' ? 'badge-success' :
                        program.Approval_Status === 'Pending' ? 'badge-warning' :
                        'badge-danger'
                      }`}>
                        {program.Approval_Status || '-'}
                      </span>
                    </td>
                    <td>{program.Enrolled_Count || 0}</td>
                    <td>{program.Completed_Count || 0}</td>
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

export default Training;

