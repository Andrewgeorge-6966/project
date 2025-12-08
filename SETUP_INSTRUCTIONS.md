# Setup Instructions - Next Steps

## Step 1: Re-import the Database

Since the SQL file had syntax errors that are now fixed, you need to re-import it to ensure all functions, triggers, and views are created properly.

Run this command in your terminal:

```bash
mysql -u root -p < database/milestone\ FULLLL.sql
```

This will:
- Drop and recreate the HR database
- Create all tables
- Insert all data
- Create all stored procedures
- Create all functions
- Create all triggers
- Create all views

## Step 2: Verify Database Import

After importing, verify that functions and triggers were created:

```bash
mysql -u root -p -e "USE HR; SHOW FUNCTION STATUS WHERE Db = 'HR';"
mysql -u root -p -e "USE HR; SHOW TRIGGERS;"
```

You should see several functions and triggers listed.

## Step 3: Configure Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a `.env` file with your database credentials:
   ```bash
   cp .env.example .env
   ```
   
   Then edit `.env` and set your MySQL credentials:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=HR
   DB_PORT=3306
   PORT=5000
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the backend server:
   ```bash
   npm start
   ```
   
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

   The backend should start on `http://localhost:5000`

## Step 4: Configure Frontend

1. Open a new terminal window and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. (Optional) Create a `.env` file if you need to change the API URL:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. Start the frontend development server:
   ```bash
   npm start
   ```

   The frontend should start on `http://localhost:3000` and automatically open in your browser.

## Step 5: Test the Application

1. Open your browser and go to `http://localhost:3000`
2. You should see the HR Management System dashboard
3. Navigate through different sections:
   - Dashboard (overview with statistics)
   - Employees (list and details)
   - Jobs (list and details)
   - Departments (organizational structure)
   - Performance (cycles, appraisals, KPI scores)
   - Training (programs and enrollments)

## Troubleshooting

### If backend fails to connect to database:
- Check your `.env` file has correct credentials
- Verify MySQL is running: `mysql -u root -p -e "SELECT 1;"`
- Check database exists: `mysql -u root -p -e "SHOW DATABASES LIKE 'HR';"`

### If frontend can't connect to backend:
- Verify backend is running on port 5000
- Check browser console for CORS errors
- Verify API URL in frontend `.env` file

### If you see "Module not found" errors:
- Run `npm install` in both backend and frontend directories
- Delete `node_modules` and reinstall if needed

## Quick Start Commands Summary

```bash
# Terminal 1: Backend
cd backend
npm install
# Create .env file with your database credentials
npm start

# Terminal 2: Frontend  
cd frontend
npm install
npm start
```

Then open `http://localhost:3000` in your browser!

