import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../config/api';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await api.get('/employees');
      setEmployees(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setLoading(false);
    }
  };

  const filteredEmployees = employees.filter(emp =>
    `${emp.First_Name} ${emp.Last_Name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.Work_Email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.Job_Title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div>
      <div className="card-header" style={{ marginBottom: '20px' }}>
        <h1 className="card-title">Employees</h1>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
            style={{ width: '300px' }}
          />
        </div>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Job Title</th>
                <th>Department</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center' }}>No employees found</td>
                </tr>
              ) : (
                filteredEmployees.map((employee) => (
                  <tr key={employee.Employee_ID}>
                    <td>{employee.Employee_ID}</td>
                    <td>{employee.First_Name} {employee.Last_Name}</td>
                    <td>{employee.Work_Email || '-'}</td>
                    <td>{employee.Job_Title || '-'}</td>
                    <td>{employee.Department_Name || '-'}</td>
                    <td>
                      <span className={`badge ${
                        employee.Employment_Status === 'Active' ? 'badge-success' :
                        employee.Employment_Status === 'Probation' ? 'badge-warning' :
                        'badge-danger'
                      }`}>
                        {employee.Employment_Status || '-'}
                      </span>
                    </td>
                    <td>
                      <Link to={`/employees/${employee.Employee_ID}`} className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '12px' }}>
                        View
                      </Link>
                    </td>
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

export default Employees;

