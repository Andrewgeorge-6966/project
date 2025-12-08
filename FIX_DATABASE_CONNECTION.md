# Fix Database Connection - Data Not Appearing

## Problem
The frontend and backend are running, but no data is showing because the backend can't connect to the MySQL database.

## Solution Steps

### Step 1: Set Your MySQL Password in .env File

The backend needs your MySQL password to connect. You have two options:

#### Option A: Edit the .env file manually

1. Open `backend/.env` file
2. Replace `DB_PASSWORD=` with your MySQL root password:
   ```
   DB_PASSWORD=your_mysql_password_here
   ```

#### Option B: Use the setup script

Run this command:
```bash
./setup-database.sh
```

It will prompt you for your MySQL password and configure everything.

### Step 2: Verify Database Has Data

Check if your database has data:

```bash
mysql -u root -p -e "USE HR; SELECT COUNT(*) FROM EMPLOYEE;"
```

You should see 8 employees. If you see 0, you need to re-import the database:

```bash
mysql -u root -p < database/milestone\ FULLLL.sql
```

### Step 3: Restart Backend Server

After updating the .env file, you MUST restart the backend:

1. **Stop the current backend server** (press Ctrl+C in the terminal where it's running)

2. **Start it again:**
   ```bash
   cd backend
   npm start
   ```

   You should see: `Server is running on port 5001`

### Step 4: Test the Connection

Test if the API can now access the database:

```bash
curl http://localhost:5001/api/dashboard/stats
```

You should see JSON with actual numbers like:
```json
{
  "totalEmployees": 8,
  "activeEmployees": 8,
  "totalJobs": 6,
  ...
}
```

### Step 5: Refresh Frontend

Refresh your browser at `http://localhost:3000` and you should now see:
- Dashboard with statistics
- Employee list with 8 employees
- Jobs, departments, performance data, etc.

## Common Issues

### Issue: "Access denied for user 'root'@'localhost'"
**Solution:** Your MySQL password is wrong or missing in `.env` file

### Issue: "Unknown database 'HR'"
**Solution:** Database not imported. Run:
```bash
mysql -u root -p < database/milestone\ FULLLL.sql
```

### Issue: Data still not showing after restart
**Solution:** 
1. Check browser console (F12) for errors
2. Check backend terminal for error messages
3. Verify .env file has correct password
4. Make sure you restarted the backend after changing .env

## Quick Checklist

- [ ] `.env` file exists in `backend/` directory
- [ ] `.env` file has correct MySQL password
- [ ] Database `HR` exists and has data (8 employees)
- [ ] Backend server restarted after .env changes
- [ ] Frontend refreshed in browser
- [ ] No errors in browser console (F12)
- [ ] No errors in backend terminal

## Still Not Working?

1. Check backend terminal for error messages
2. Open browser console (F12) and check Network tab
3. Verify API is responding: `curl http://localhost:5001/api/health`
4. Test database directly: `mysql -u root -p -e "USE HR; SELECT * FROM EMPLOYEE LIMIT 1;"`

