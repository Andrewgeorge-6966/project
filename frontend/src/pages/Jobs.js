import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../config/api';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await api.get('/jobs');
      setJobs(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job =>
    job.Job_Title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.Job_Code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.Department_Name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div>
      <div className="card-header" style={{ marginBottom: '20px' }}>
        <h1 className="card-title">Jobs</h1>
        <input
          type="text"
          placeholder="Search jobs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-input"
          style={{ width: '300px' }}
        />
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Title</th>
                <th>Level</th>
                <th>Category</th>
                <th>Department</th>
                <th>Salary Range</th>
                <th>Status</th>
                <th>Active Assignments</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center' }}>No jobs found</td>
                </tr>
              ) : (
                filteredJobs.map((job) => (
                  <tr key={job.Job_ID}>
                    <td>{job.Job_Code}</td>
                    <td>{job.Job_Title}</td>
                    <td>{job.Job_Level || '-'}</td>
                    <td>{job.Job_Category || '-'}</td>
                    <td>{job.Department_Name || '-'}</td>
                    <td>
                      {job.Min_Salary && job.Max_Salary
                        ? `${job.Min_Salary.toLocaleString()} - ${job.Max_Salary.toLocaleString()}`
                        : '-'}
                    </td>
                    <td>
                      <span className={`badge ${
                        job.Status === 'Open' ? 'badge-success' : 'badge-warning'
                      }`}>
                        {job.Status || '-'}
                      </span>
                    </td>
                    <td>{job.Active_Assignments || 0}</td>
                    <td>
                      <Link to={`/jobs/${job.Job_ID}`} className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '12px' }}>
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

export default Jobs;

