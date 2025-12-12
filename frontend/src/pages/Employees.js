import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../config/api';

const Employees = () => {
  const [adminToken, setAdminToken] = useState(localStorage.getItem('admin_token') || '');
  const isAdmin = !!adminToken;
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalMode, setModalMode] = useState(null); // 'create' | 'edit' | null
  const [current, setCurrent] = useState(null);
  const [form, setForm] = useState({
    First_Name: '',
    Last_Name: '',
    Work_Email: '',
    Employment_Status: 'Active'
  });
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => { fetchEmployees(); }, []);

  const fetchEmployees = async () => {
    try {
      const response = await api.get('/employees');
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally { setLoading(false); }
  };

  const openCreate = () => {
    setForm({ First_Name: '', Last_Name: '', Work_Email: '', Employment_Status: 'Active' });
    setModalMode('create');
  };

  const openEdit = (emp) => {
    setCurrent(emp);
    setForm({
      First_Name: emp.First_Name || '',
      Last_Name: emp.Last_Name || '',
      Work_Email: emp.Work_Email || '',
      Employment_Status: emp.Employment_Status || 'Active'
    });
    setModalMode('edit');
  };

  const closeModal = () => { setModalMode(null); setCurrent(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { 'x-admin-token': adminToken } };
      if (modalMode === 'create') {
        await api.post('/employees', form, config);
      } else if (modalMode === 'edit' && current) {
        await api.put(`/employees/${current.Employee_ID}`, form, config);
      }
      closeModal();
      fetchEmployees();
    } catch (error) {
      alert('Error saving employee: ' + error.message);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/employees/${deleteTarget.Employee_ID}`, { headers: { 'x-admin-token': adminToken } });
      setDeleteTarget(null);
      fetchEmployees();
    } catch (error) {
      alert('Error deleting employee: ' + error.message);
    }
  };

  const filteredEmployees = employees.filter(emp =>
    `${emp.First_Name} ${emp.Last_Name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.Work_Email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.Job_Title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="spinner"></div>;

  return (
    <div className="fade-in">
      <div className="card-header" style={{ marginBottom: '20px' }}>
        <h1 className="card-title">Employees</h1>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Search employees..."
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
          {isAdmin && (
            <button className="btn btn-primary" onClick={openCreate}>
              + Add Employee
            </button>
          )}
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
                    <td style={{ display: 'flex', gap: '6px' }}>
                      <Link to={`/employees/${employee.Employee_ID}`} className="btn btn-secondary" style={{ padding: '6px 10px', fontSize: '12px' }}>
                        View
                      </Link>
                      {isAdmin && (
                        <>
                          <button className="btn btn-primary" style={{ padding: '6px 10px', fontSize: '12px' }} onClick={() => openEdit(employee)}>
                            Edit
                          </button>
                          <button className="btn btn-danger" style={{ padding: '6px 10px', fontSize: '12px' }} onClick={() => setDeleteTarget(employee)}>
                            Delete
                          </button>
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
              {modalMode === 'create' ? 'Add Employee' : 'Edit Employee'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input className="form-input" value={form.First_Name} onChange={e => setForm({ ...form, First_Name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input className="form-input" value={form.Last_Name} onChange={e => setForm({ ...form, Last_Name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Work Email</label>
                <input className="form-input" value={form.Work_Email} onChange={e => setForm({ ...form, Work_Email: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Employment Status</label>
                <select className="form-select" value={form.Employment_Status} onChange={e => setForm({ ...form, Employment_Status: e.target.value })}>
                  <option>Active</option>
                  <option>Probation</option>
                  <option>Leave</option>
                  <option>Resigned</option>
                  <option>Retired</option>
                </select>
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
            <p>Delete employee <strong>{deleteTarget.First_Name} {deleteTarget.Last_Name}</strong>?</p>
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

export default Employees;

