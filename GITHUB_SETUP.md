# How to Share Your Project on GitHub

## Step 1: Initialize Git Repository

Run these commands in your project directory:

```bash
cd "/Users/andrewgeorge/Desktop/Databases /project"
git init
```

## Step 2: Add All Files (except those in .gitignore)

```bash
git add .
```

This will add all files except:
- `node_modules/` (already ignored)
- `.env` files (already ignored - contains your password!)
- `.DS_Store` (Mac system files)
- `build/` and `dist/` folders

## Step 3: Create Initial Commit

```bash
git commit -m "Initial commit: HR Management System with React frontend and Node.js backend"
```

## Step 4: Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the **"+"** icon in the top right
3. Select **"New repository"**
4. Fill in:
   - **Repository name**: `hr-management-system` (or any name you like)
   - **Description**: "HR Management System for universities with React frontend and MySQL backend"
   - **Visibility**: Choose Public or Private
   - **DO NOT** check "Initialize with README" (we already have one)
5. Click **"Create repository"**

## Step 5: Connect Local Repository to GitHub

After creating the repository, GitHub will show you commands. Use these:

```bash
git remote add origin https://github.com/YOUR_USERNAME/hr-management-system.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## Step 6: Verify

Go to your GitHub repository page and you should see all your files!

---

## Important Notes

### ✅ What's Already Protected

Your `.gitignore` files are set up to **NOT** upload:
- `.env` files (contains your database password!)
- `node_modules/` folders
- Build files
- System files

### ⚠️ Before Pushing

Make sure your `.env` file is NOT committed:
```bash
git status
# Make sure you don't see backend/.env in the list
```

### 📝 Optional: Add .env.example

You can create a template file for others:

```bash
# Create example file without password
cat > backend/.env.example << 'EOF'
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=HR
DB_PORT=3306
PORT=5001
EOF

git add backend/.env.example
git commit -m "Add .env.example template"
git push
```

---

## Quick Commands Summary

```bash
# 1. Initialize
git init

# 2. Add files
git add .

# 3. Commit
git commit -m "Initial commit: HR Management System"

# 4. Add remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/hr-management-system.git

# 5. Push
git branch -M main
git push -u origin main
```

---

## Troubleshooting

### If you get "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/hr-management-system.git
```

### If you need to update later
```bash
git add .
git commit -m "Update: description of changes"
git push
```

### If you accidentally committed .env
```bash
# Remove from git (but keep local file)
git rm --cached backend/.env
git commit -m "Remove .env from repository"
git push
```

