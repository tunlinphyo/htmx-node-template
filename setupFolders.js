const fs = require('fs');
const path = require('path');
const { execSync, exec } = require('child_process');
const chokidar = require('chokidar');

const publicDir = path.join(__dirname, 'src/public');

// Remove existing public directory
if (fs.existsSync(publicDir)) {
  fs.rmSync(publicDir, { recursive: true, force: true });
  console.log('Removed existing public directory');
}

// Recreate directories for JS and CSS
fs.mkdirSync(path.join(publicDir, 'js'), { recursive: true });
fs.mkdirSync(path.join(publicDir, 'css'), { recursive: true });
console.log('Created public/js and public/css directories');
