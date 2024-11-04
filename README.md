To start backend server:

cd backend && node app.js

To start frontend server:

cd frontend && python3 -m http.server {your selected port}

To check database:

cd backend/db && sqlite3 database.db



#!/bin/bash

# Update package list and install prerequisites
sudo apt update

# Install Node.js and npm (using NodeSource for the latest LTS version)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify Node.js and npm installation
echo "Node.js version: $(node -v)"
echo "npm version: $(npm -v)"

# Initialize a new npm project if no package.json exists
if [ ! -f "package.json" ]; then
  npm init -y
fi

# Install required Node.js libraries
npm install express path sqlite3 body-parser cors express-session

echo "All required libraries installed."

# Confirm installation
echo "Installed libraries:"
npm list express path sqlite3 body-parser cors express-session --depth=0

echo "Setup complete."


