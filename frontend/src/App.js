import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import EmployeeDetail from './pages/EmployeeDetail';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import Departments from './pages/Departments';
import Performance from './pages/Performance';
import Training from './pages/Training';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/employees/:id" element={<EmployeeDetail />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
            <Route path="/departments" element={<Departments />} />
            <Route path="/performance" element={<Performance />} />
            <Route path="/training" element={<Training />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

