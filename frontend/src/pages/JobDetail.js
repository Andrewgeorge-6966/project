import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../config/api';

const JobDetail = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobData();
  }, [id]);

  const fetchJobData = async () => {
    try {
      const [jobRes, assignRes] = await Promise.all([
        api.get(`/jobs/${id}`),
        api.get(`/jobs/${id}/assignments`),
      ]);

      setJob(jobRes.data);
      setAssignments(assignRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching job data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  if (!job) {
    return <div>Job not found</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <Link to="/jobs" className="btn btn-secondary">← Back to Jobs</Link>
      </div>

      {/* Job Info */}
      <div className="card">
        <h2 className="card-title">{job.Job_Title}</h2>
        <div className="grid grid-2">
          <div>
            <p><strong>Job Code:</strong> {job.Job_Code}</p>
            <p><strong>Level:</strong> {job.Job_Level || '-'}</p>
            <p><strong>Category:</strong> {job.Job_Category || '-'}</p>
            <p><strong>Grade:</strong> {job.Job_Grade || '-'}</p>
            <p><strong>Department:</strong> {job.Department_Name || '-'}</p>
          </div>
          <div>
            <p><strong>University:</strong> {job.University_Name || '-'}</p>
            <p><strong>Faculty:</strong> {job.Faculty_Name || '-'}</p>
            <p><strong>Min Salary:</strong> {job.Min_Salary ? job.Min_Salary.toLocaleString() : '-'}</p>
            <p><strong>Max Salary:</strong> {job.Max_Salary ? job.Max_Salary.toLocaleString() : '-'}</p>
            <p><strong>Status:</strong> 
              <span className={`badge ${
                job.Status === 'Open' ? 'badge-success' : 'badge-warning'
              }`} style={{ marginLeft: '10px' }}>
                {job.Status || '-'}
              </span>
            </p>
          </div>
        </div>
        {job.Job_Description && (
          <div style={{ marginTop: '20px' }}>
            <h4>Description</h4>
            <p>{job.Job_Description}</p>
          </div>
        )}
      </div>

      {/* Job Assignments */}
      <div className="card">
        <h3 className="card-title">Current Assignments</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Email</th>
                <th>Contract</th>
                <th>Start Date</th>
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
                    <td>
                      <Link to={`/employees/${assignment.Employee_ID}`}>
                        {assignment.First_Name} {assignment.Last_Name}
                      </Link>
                    </td>
                    <td>{assignment.Work_Email || '-'}</td>
                    <td>{assignment.Contract_Name}</td>
                    <td>{new Date(assignment.Start_Date).toLocaleDateString()}</td>
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
    </div>
  );
};

export default JobDetail;

