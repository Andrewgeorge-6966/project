import React, { useState, useEffect } from 'react';
import api from '../config/api';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

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
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div>
      <h1 style={{ marginBottom: '30px', color: '#333' }}>Organizational Structure</h1>

      {/* Universities */}
      <div className="card">
        <h2 className="card-title">Universities ({universities.length})</h2>
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
        <h2 className="card-title">Faculties ({faculties.length})</h2>
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
        <h2 className="card-title">Departments ({departments.length})</h2>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Departments;

