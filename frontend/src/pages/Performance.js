import React, { useState, useEffect } from 'react';
import api from '../config/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Performance = () => {
  const [cycles, setCycles] = useState([]);
  const [appraisals, setAppraisals] = useState([]);
  const [kpiScores, setKpiScores] = useState([]);
  const [selectedCycle, setSelectedCycle] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedCycle) {
      fetchKpiScores();
    }
  }, [selectedCycle]);

  const fetchData = async () => {
    try {
      const [cyclesRes, appraisalsRes] = await Promise.all([
        api.get('/performance/cycles'),
        api.get('/performance/appraisals'),
      ]);

      setCycles(cyclesRes.data);
      setAppraisals(appraisalsRes.data);
      if (cyclesRes.data.length > 0) {
        setSelectedCycle(cyclesRes.data[0].Cycle_ID.toString());
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching performance data:', error);
      setLoading(false);
    }
  };

  const fetchKpiScores = async () => {
    try {
      const response = await api.get(`/performance/kpi-scores?cycle_id=${selectedCycle}`);
      setKpiScores(response.data);
    } catch (error) {
      console.error('Error fetching KPI scores:', error);
    }
  };

  // Prepare chart data
  const chartData = appraisals.reduce((acc, appraisal) => {
    const cycle = appraisal.Cycle_Name;
    if (!acc[cycle]) {
      acc[cycle] = { cycle, count: 0, totalScore: 0 };
    }
    acc[cycle].count++;
    acc[cycle].totalScore += appraisal.Overall_Score || 0;
    return acc;
  }, {});

  const chartDataArray = Object.values(chartData).map(item => ({
    cycle: item.cycle,
    avgScore: item.totalScore / item.count,
    count: item.count,
  }));

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div>
      <h1 style={{ marginBottom: '30px', color: '#333' }}>Performance Management</h1>

      {/* Performance Cycles */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Performance Cycles</h2>
          <select
            value={selectedCycle}
            onChange={(e) => setSelectedCycle(e.target.value)}
            className="form-select"
            style={{ width: '300px' }}
          >
            {cycles.map((cycle) => (
              <option key={cycle.Cycle_ID} value={cycle.Cycle_ID}>
                {cycle.Cycle_Name} ({cycle.Cycle_Type})
              </option>
            ))}
          </select>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Cycle Name</th>
                <th>Type</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Deadline</th>
              </tr>
            </thead>
            <tbody>
              {cycles.map((cycle) => (
                <tr key={cycle.Cycle_ID}>
                  <td>{cycle.Cycle_Name}</td>
                  <td>{cycle.Cycle_Type}</td>
                  <td>{new Date(cycle.Start_Date).toLocaleDateString()}</td>
                  <td>{new Date(cycle.End_Date).toLocaleDateString()}</td>
                  <td>{new Date(cycle.Submission_Deadline).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Chart */}
      <div className="card">
        <h3 className="card-title">Average Scores by Cycle</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartDataArray}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="cycle" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="avgScore" fill="#667eea" name="Average Score" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Appraisals */}
      <div className="card">
        <h3 className="card-title">Appraisals</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Job Title</th>
                <th>Cycle</th>
                <th>Score</th>
                <th>Date</th>
                <th>Manager Comments</th>
              </tr>
            </thead>
            <tbody>
              {appraisals.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center' }}>No appraisals found</td>
                </tr>
              ) : (
                appraisals.map((appraisal) => (
                  <tr key={appraisal.Appraisal_ID}>
                    <td>{appraisal.First_Name} {appraisal.Last_Name}</td>
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
                    <td>{appraisal.Manager_Comments || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* KPI Scores */}
      {selectedCycle && (
        <div className="card">
          <h3 className="card-title">KPI Scores - Selected Cycle</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>KPI</th>
                  <th>Target</th>
                  <th>Actual</th>
                  <th>Score</th>
                  <th>Weighted Score</th>
                </tr>
              </thead>
              <tbody>
                {kpiScores.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center' }}>No KPI scores found</td>
                  </tr>
                ) : (
                  kpiScores.map((score) => (
                    <tr key={score.Score_ID}>
                      <td>{score.First_Name} {score.Last_Name}</td>
                      <td>{score.KPI_Name}</td>
                      <td>{score.Target_Value || '-'}</td>
                      <td>{score.Actual_Value || '-'}</td>
                      <td>{score.Employee_Score || '-'}</td>
                      <td>{score.Weighted_Score ? parseFloat(score.Weighted_Score).toFixed(2) : '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Performance;

