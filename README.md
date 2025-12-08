# HR Management System

A comprehensive Human Resources Management System for universities, built with React frontend and Node.js/Express backend, connected to a MySQL database.

## Features

- **Employee Management**: View and manage employee information, assignments, and details
- **Job Management**: Manage job positions, requirements, and assignments
- **Department Structure**: View organizational hierarchy (Universities → Faculties → Departments)
- **Performance Management**: Track performance cycles, appraisals, and KPI scores
- **Training Management**: Manage training programs and employee enrollments
- **Dashboard**: Overview with statistics, charts, and recent activities

## Project Structure

```
project/
├── backend/              # Node.js/Express API
│   ├── config/          # Database configuration
│   ├── routes/          # API routes
│   └── server.js        # Main server file
├── frontend/            # React application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   └── config/      # API configuration
│   └── public/          # Static files
└── database/            # SQL database file
    └── milestone FULLLL.sql
```

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## Setup Instructions

### 1. Database Setup

1. Make sure MySQL is running
2. Import the database:
   ```bash
   mysql -u root -p < database/milestone\ FULLLL.sql
   ```
   Or use MySQL Workbench to import the SQL file

### 2. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=HR
   DB_PORT=3306
   PORT=5000
   ```

4. Start the backend server:
   ```bash
   npm start
   ```
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

   The backend will run on `http://localhost:5000`

### 3. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend directory (optional, defaults to localhost:5000):
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. Start the frontend development server:
   ```bash
   npm start
   ```

   The frontend will run on `http://localhost:3000`

## API Endpoints

### Employees
- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get employee by ID
- `POST /api/employees` - Create new employee
- `PUT /api/employees/:id` - Update employee
- `GET /api/employees/:id/assignments` - Get employee assignments
- `GET /api/employees/:id/performance` - Get employee performance

### Jobs
- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/:id` - Get job by ID
- `POST /api/jobs` - Create new job
- `PUT /api/jobs/:id` - Update job
- `GET /api/jobs/:id/assignments` - Get job assignments

### Departments
- `GET /api/departments` - Get all departments
- `GET /api/departments/universities` - Get all universities
- `GET /api/departments/faculties` - Get all faculties
- `GET /api/departments/:id` - Get department by ID

### Performance
- `GET /api/performance/cycles` - Get all performance cycles
- `GET /api/performance/appraisals` - Get all appraisals
- `GET /api/performance/kpi-scores` - Get KPI scores
- `POST /api/performance/appraisals` - Create appraisal
- `GET /api/performance/appeals` - Get appeals

### Training
- `GET /api/training/programs` - Get all training programs
- `GET /api/training/employees/:id` - Get employee training
- `POST /api/training/enroll` - Enroll employee in training
- `POST /api/training/programs` - Create training program

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/gender-distribution` - Get gender distribution
- `GET /api/dashboard/department-employees` - Get employee count by department
- `GET /api/dashboard/recent-appraisals` - Get recent appraisals

## Technologies Used

### Backend
- Node.js
- Express.js
- MySQL2
- CORS
- dotenv

### Frontend
- React
- React Router
- Axios
- Recharts (for visualizations)
- React Icons

## Database Schema

The database includes the following main entities:
- **UNIVERSITY** - University information
- **FACULTY** - Faculty information
- **DEPARTMENT** - Department information (Academic/Administrative)
- **EMPLOYEE** - Employee personal and professional information
- **JOB** - Job positions and requirements
- **JOB_ASSIGNMENT** - Employee job assignments
- **CONTRACT** - Contract types
- **PERFORMANCE_CYCLE** - Performance evaluation cycles
- **APPRAISAL** - Performance appraisals
- **EMPLOYEE_KPI_SCORE** - KPI scores for employees
- **TRAINING_PROGRAM** - Training programs
- **EMPLOYEE_TRAINING** - Employee training enrollments

## Features Overview

### Dashboard
- Key statistics (employees, jobs, departments, training)
- Gender distribution chart
- Department employee count chart
- Recent appraisals table

### Employee Management
- List all employees with search functionality
- View detailed employee information
- View employee job assignments
- View employee performance history
- View employee training records

### Job Management
- List all job positions
- View job details including objectives and KPIs
- View current job assignments

### Department Structure
- View organizational hierarchy
- Universities, Faculties, and Departments
- Employee and job counts per department

### Performance Management
- View performance cycles
- Track appraisals and scores
- View KPI scores by cycle
- Performance analytics

### Training Management
- View all training programs
- Track enrollments and completions
- View training statistics

## Development Notes

- The backend uses MySQL connection pooling for efficient database connections
- CORS is enabled for cross-origin requests
- The frontend uses React Router for navigation
- All API calls are centralized through the `api.js` config file
- Responsive design for mobile and desktop views

## Troubleshooting

1. **Database Connection Error**: 
   - Check MySQL is running
   - Verify credentials in `.env` file
   - Ensure database `HR` exists

2. **Port Already in Use**:
   - Change PORT in backend `.env` file
   - Or kill the process using the port

3. **CORS Errors**:
   - Ensure backend CORS is properly configured
   - Check API URL in frontend `.env`

4. **Module Not Found**:
   - Run `npm install` in both backend and frontend directories
   - Delete `node_modules` and reinstall if needed

## License

This project is created for educational purposes.

