import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../config/api';

const Jobs = () => {
  const [adminToken, setAdminToken] = useState(localStorage.getItem('admin_token') || '');
  const isAdmin = !!adminToken;
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalMode, setModalMode] = useState(null);
  const [current, setCurrent] = useState(null);
  const [form, setForm] = useState({
    Job_Code: '',
    Job_Title: '',
    Job_Level: '',
    Job_Category: '',
    Min_Salary: '',
    Max_Salary: '',
    Status: 'Open',
    Department_ID: ''
  });
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => { fetchJobs(); }, []);

  const fetchJobs = async () => {
    try {
      const response = await api.get('/jobs');
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally { setLoading(false); }
  };

  const openCreate = () => {
    setForm({ Job_Code: '', Job_Title: '', Job_Level: '', Job_Category: '', Min_Salary: '', Max_Salary: '', Status: 'Open', Department_ID: '' });
    setModalMode('create');
  };

  const openEdit = (job) => {
    setCurrent(job);
    setForm({
      Job_Code: job.Job_Code || '',
      Job_Title: job.Job_Title || '',
      Job_Level: job.Job_Level || '',
      Job_Category: job.Job_Category || '',
      Min_Salary: job.Min_Salary || '',
      Max_Salary: job.Max_Salary || '',
      Status: job.Status || 'Open',
      Department_ID: job.Department_ID || ''
    });
    setModalMode('edit');
  };

  const closeModal = () => { setModalMode(null); setCurrent(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { 'x-admin-token': adminToken } };
      if (modalMode === 'create') {
        await api.post('/jobs', form, config);
      } else if (modalMode === 'edit' && current) {
        await api.put(`/jobs/${current.Job_ID}`, form, config);
      }
      closeModal();
      fetchJobs();
    } catch (error) {
      alert('Error saving job: ' + error.message);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/jobs/${deleteTarget.Job_ID}`, { headers: { 'x-admin-token': adminToken } });
      setDeleteTarget(null);
      fetchJobs();
    } catch (error) {
      alert('Error deleting job: ' + error.message);
    }
  };

  const filteredJobs = jobs.filter(job =>
    job.Job_Title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.Job_Code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.Department_Name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="spinner"></div>;

  return (
    <div className="fade-in">
      <div className="card-header" style={{ marginBottom: '20px' }}>
        <h1 className="card-title">Jobs</h1>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
            style={{ width: '280px' }}
          />
          <button
            className="btn btn-secondary"
            onClick={() => {
              const token = prompt('Enter admin token');
              if (token !== null) {
                localStorage.setItem('admin_token', token);
                setAdminToken(token);
              }
            }}
          >
            {isAdmin ? 'Change Admin Token' : 'Set Admin Token'}
          </button>
          {isAdmin && <button className="btn btn-primary" onClick={openCreate}>+ Add Job</button>}
        </div>
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
                    <td style={{ display: 'flex', gap: '6px' }}>
                      <Link to={`/jobs/${job.Job_ID}`} className="btn btn-secondary" style={{ padding: '6px 10px', fontSize: '12px' }}>
                        View
                      </Link>
                      {isAdmin && (
                        <>
                          <button className="btn btn-primary" style={{ padding: '6px 10px', fontSize: '12px' }} onClick={() => openEdit(job)}>Edit</button>
                          <button className="btn btn-danger" style={{ padding: '6px 10px', fontSize: '12px' }} onClick={() => setDeleteTarget(job)}>Delete</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {modalMode && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3 className="card-title" style={{ marginBottom: '16px' }}>
              {modalMode === 'create' ? 'Add Job' : 'Edit Job'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Job Code</label>
                <input className="form-input" value={form.Job_Code} onChange={e => setForm({ ...form, Job_Code: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input className="form-input" value={form.Job_Title} onChange={e => setForm({ ...form, Job_Title: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Level</label>
                <input className="form-input" value={form.Job_Level} onChange={e => setForm({ ...form, Job_Level: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <input className="form-input" value={form.Job_Category} onChange={e => setForm({ ...form, Job_Category: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Min Salary</label>
                <input className="form-input" type="number" value={form.Min_Salary} onChange={e => setForm({ ...form, Min_Salary: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Max Salary</label>
                <input className="form-input" type="number" value={form.Max_Salary} onChange={e => setForm({ ...form, Max_Salary: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-select" value={form.Status} onChange={e => setForm({ ...form, Status: e.target.value })}>
                  <option>Open</option>
                  <option>Closed</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Department ID</label>
                <input className="form-input" value={form.Department_ID} onChange={e => setForm({ ...form, Department_ID: e.target.value })} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3 className="card-title" style={{ marginBottom: '12px' }}>Confirm delete</h3>
            <p>Delete job <strong>{deleteTarget.Job_Title}</strong>?</p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Jobs;

