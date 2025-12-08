#!/bin/bash

echo "=========================================="
echo "HR Management System - Database Setup"
echo "=========================================="
echo ""
echo "This script will help you configure the database connection."
echo ""

# Check if .env exists
if [ -f "backend/.env" ]; then
    echo "✓ .env file exists"
else
    echo "Creating .env file..."
    cat > backend/.env << 'ENVEOF'
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_PASSWORD_HERE
DB_NAME=HR
DB_PORT=3306
PORT=5001
ENVEOF
    echo "✓ .env file created"
fi

echo ""
echo "Please enter your MySQL root password:"
read -s MYSQL_PASSWORD

# Update .env with password
sed -i '' "s/DB_PASSWORD=.*/DB_PASSWORD=$MYSQL_PASSWORD/" backend/.env

echo ""
echo "Testing database connection..."
mysql -u root -p"$MYSQL_PASSWORD" -e "USE HR; SELECT COUNT(*) as employee_count FROM EMPLOYEE;" 2>&1

if [ $? -eq 0 ]; then
    echo ""
    echo "✓ Database connection successful!"
    echo ""
    echo "Now restart your backend server:"
    echo "  1. Stop the current backend (Ctrl+C)"
    echo "  2. Run: cd backend && npm start"
else
    echo ""
    echo "✗ Database connection failed!"
    echo "Please check:"
    echo "  1. MySQL is running"
    echo "  2. Password is correct"
    echo "  3. Database 'HR' exists"
    echo ""
    echo "To import the database, run:"
    echo "  mysql -u root -p < database/milestone\\ FULLLL.sql"
fi

