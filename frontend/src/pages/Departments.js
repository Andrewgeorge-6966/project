import React, { useState, useEffect } from 'react';
import api from '../config/api';

const Departments = () => {
  const [adminToken, setAdminToken] = useState(localStorage.getItem('admin_token') || '');
  const isAdmin = !!adminToken;
  const [departments, setDepartments] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState(null);
  const [current, setCurrent] = useState(null);
  const [form, setForm] = useState({
    Department_Name: '',
    Department_Type: 'Academic',
    Location: '',
    Contact_Email: '',
    Faculty_ID: ''
  });
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [deptRes, univRes, facRes] = await Promise.all([
        api.get('/departments'),
        api.get('/departments/universities'),
        api.get('/departments/faculties'),
      ]);
      setDepartments(deptRes.data);
      setUniversities(univRes.data);
      setFaculties(facRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally { setLoading(false); }
  };

  const openCreate = () => {
    setForm({ Department_Name: '', Department_Type: 'Academic', Location: '', Contact_Email: '', Faculty_ID: '' });
    setModalMode('create');
  };

  const openEdit = (dept) => {
    setCurrent(dept);
    setForm({
      Department_Name: dept.Department_Name || '',
      Department_Type: dept.Department_Type || 'Academic',
      Location: dept.Location || '',
      Contact_Email: dept.Contact_Email || '',
      Faculty_ID: dept.Faculty_ID || ''
    });
    setModalMode('edit');
  };

  const closeModal = () => { setModalMode(null); setCurrent(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { 'x-admin-token': adminToken } };
      if (modalMode === 'create') {
        await api.post('/departments', form, config);
      } else if (modalMode === 'edit' && current) {
        await api.put(`/departments/${current.Department_ID}`, form, config);
      }
      closeModal();
      fetchData();
    } catch (error) {
      alert('Error saving department: ' + error.message);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/departments/${deleteTarget.Department_ID}`, { headers: { 'x-admin-token': adminToken } });
      setDeleteTarget(null);
      fetchData();
    } catch (error) {
      alert('Error deleting department: ' + error.message);
    }
  };

  if (loading) return <div className="spinner"></div>;

  return (
    <div className="fade-in">
      <h1 style={{ marginBottom: '24px', color: 'var(--text)' }}>Organizational Structure</h1>
      <div className="card" style={{ marginBottom: '18px' }}>
        <div className="card-header">
          <h3 className="card-title">Admin Token</h3>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-dim)', fontSize: '13px' }}>
              {isAdmin ? 'Admin token set' : 'No admin token set'}
            </span>
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
              {isAdmin ? 'Change Token' : 'Set Token'}
            </button>
          </div>
        </div>
      </div>

      {/* Universities */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Universities ({universities.length})</h2>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Acronym</th>
                <th>Established</th>
                <th>Accreditation</th>
                <th>Website</th>
              </tr>
            </thead>
            <tbody>
              {universities.map((univ) => (
                <tr key={univ.University_ID}>
                  <td>{univ.University_Name}</td>
                  <td>{univ.Acronym || '-'}</td>
                  <td>{univ.Established_Year || '-'}</td>
                  <td>{univ.Accreditation_Body || '-'}</td>
                  <td>
                    {univ.Website_URL ? (
                      <a href={univ.Website_URL} target="_blank" rel="noopener noreferrer">
                        Visit
                      </a>
                    ) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Faculties */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Faculties ({faculties.length})</h2>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>University</th>
                <th>Location</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {faculties.map((faculty) => (
                <tr key={faculty.Faculty_ID}>
                  <td>{faculty.Faculty_Name}</td>
                  <td>{faculty.University_Name}</td>
                  <td>{faculty.Location || '-'}</td>
                  <td>{faculty.Contact_Email || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Departments */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Departments ({departments.length})</h2>
          {isAdmin && <button className="btn btn-primary" onClick={openCreate}>+ Add Department</button>}
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Faculty</th>
                <th>University</th>
                <th>Jobs</th>
                <th>Employees</th>
                {isAdmin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {departments.map((dept) => (
                <tr key={dept.Department_ID}>
                  <td>{dept.Department_Name}</td>
                  <td>
                    <span className={`badge ${
                      dept.Department_Type === 'Academic' ? 'badge-info' : 'badge-secondary'
                    }`}>
                      {dept.Department_Type}
                    </span>
                  </td>
                  <td>{dept.Faculty_Name || '-'}</td>
                  <td>{dept.University_Name || '-'}</td>
                  <td>{dept.Total_Jobs || 0}</td>
                  <td>{dept.Total_Employees || 0}</td>
                  {isAdmin && (
                    <td style={{ display: 'flex', gap: '6px' }}>
                      <button className="btn btn-primary" style={{ padding: '6px 10px', fontSize: '12px' }} onClick={() => openEdit(dept)}>Edit</button>
                      <button className="btn btn-danger" style={{ padding: '6px 10px', fontSize: '12px' }} onClick={() => setDeleteTarget(dept)}>Delete</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {modalMode && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3 className="card-title" style={{ marginBottom: '16px' }}>
              {modalMode === 'create' ? 'Add Department' : 'Edit Department'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Department Name</label>
                <input className="form-input" value={form.Department_Name} onChange={e => setForm({ ...form, Department_Name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Type</label>
                <select className="form-select" value={form.Department_Type} onChange={e => setForm({ ...form, Department_Type: e.target.value })}>
                  <option>Academic</option>
                  <option>Administrative</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Location</label>
                <input className="form-input" value={form.Location} onChange={e => setForm({ ...form, Location: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Contact Email</label>
                <input className="form-input" value={form.Contact_Email} onChange={e => setForm({ ...form, Contact_Email: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Faculty ID</label>
                <input className="form-input" value={form.Faculty_ID} onChange={e => setForm({ ...form, Faculty_ID: e.target.value })} />
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
            <p>Delete department <strong>{deleteTarget.Department_Name}</strong>?</p>
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

export default Departments;

