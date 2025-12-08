import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../config/api';

const EmployeeDetail = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [performance, setPerformance] = useState([]);
  const [training, setTraining] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployeeData();
  }, [id]);

  const fetchEmployeeData = async () => {
    try {
      const [empRes, assignRes, perfRes, trainRes] = await Promise.all([
        api.get(`/employees/${id}`),
        api.get(`/employees/${id}/assignments`),
        api.get(`/employees/${id}/performance`),
        api.get(`/training/employees/${id}`),
      ]);

      setEmployee(empRes.data);
      setAssignments(assignRes.data);
      setPerformance(perfRes.data);
      setTraining(trainRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching employee data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  if (!employee) {
    return <div>Employee not found</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <Link to="/employees" className="btn btn-secondary">← Back to Employees</Link>
      </div>

      {/* Employee Info */}
      <div className="card">
        <h2 className="card-title">
          {employee.First_Name} {employee.Middle_Name} {employee.Last_Name}
        </h2>
        <div className="grid grid-2">
          <div>
            <p><strong>Employee ID:</strong> {employee.Employee_ID}</p>
            <p><strong>Email:</strong> {employee.Work_Email || '-'}</p>
            <p><strong>Phone:</strong> {employee.Mobile_Phone || '-'}</p>
            <p><strong>Nationality:</strong> {employee.Nationality || '-'}</p>
            <p><strong>Gender:</strong> {employee.Gender || '-'}</p>
          </div>
          <div>
            <p><strong>Date of Birth:</strong> {employee.DOB ? new Date(employee.DOB).toLocaleDateString() : '-'}</p>
            <p><strong>Marital Status:</strong> {employee.Marital_Status || '-'}</p>
            <p><strong>Employment Status:</strong> 
              <span className={`badge ${
                employee.Employment_Status === 'Active' ? 'badge-success' :
                employee.Employment_Status === 'Probation' ? 'badge-warning' :
                'badge-danger'
              }`} style={{ marginLeft: '10px' }}>
                {employee.Employment_Status || '-'}
              </span>
            </p>
            <p><strong>Residential City:</strong> {employee.Residential_City || '-'}</p>
          </div>
        </div>
      </div>

      {/* Job Assignments */}
      <div className="card">
        <h3 className="card-title">Job Assignments</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Contract</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Salary</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {assignments.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center' }}>No assignments found</td>
                </tr>
              ) : (
                assignments.map((assignment) => (
                  <tr key={assignment.Assignment_ID}>
                    <td>{assignment.Job_Title}</td>
                    <td>{assignment.Contract_Name}</td>
                    <td>{new Date(assignment.Start_Date).toLocaleDateString()}</td>
                    <td>{assignment.End_Date ? new Date(assignment.End_Date).toLocaleDateString() : 'Ongoing'}</td>
                    <td>{assignment.Assigned_Salary?.toLocaleString() || '-'}</td>
                    <td>
                      <span className={`badge ${
                        assignment.Status === 'Active' ? 'badge-success' : 'badge-warning'
                      }`}>
                        {assignment.Status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Performance */}
      <div className="card">
        <h3 className="card-title">Performance Appraisals</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Cycle</th>
                <th>Job Title</th>
                <th>Score</th>
                <th>Date</th>
                <th>Manager Comments</th>
              </tr>
            </thead>
            <tbody>
              {performance.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>No performance records found</td>
                </tr>
              ) : (
                performance.map((appraisal) => (
                  <tr key={appraisal.Appraisal_ID}>
                    <td>{appraisal.Cycle_Name}</td>
                    <td>{appraisal.Job_Title}</td>
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
                    <td>{appraisal.Manager_Comments || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Training */}
      <div className="card">
        <h3 className="card-title">Training Programs</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Program</th>
                <th>Type</th>
                <th>Delivery Method</th>
                <th>Status</th>
                <th>Certificate</th>
              </tr>
            </thead>
            <tbody>
              {training.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>No training records found</td>
                </tr>
              ) : (
                training.map((record) => (
                  <tr key={record.ET_ID}>
                    <td>{record.Title}</td>
                    <td>{record.Type}</td>
                    <td>{record.Delivery_Method}</td>
                    <td>
                      <span className={`badge ${
                        record.Completion_Status === 'Completed' ? 'badge-success' :
                        record.Completion_Status === 'In Progress' ? 'badge-info' :
                        'badge-warning'
                      }`}>
                        {record.Completion_Status}
                      </span>
                    </td>
                    <td>{record.certificate_file_path ? '✓ Issued' : '-'}</td>
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

export default EmployeeDetail;

