const chokidar = require('chokidar');
const { exec } = require('child_process');
const fs = require('fs-extra');
const path = require('path');

const sourceDir = path.join(__dirname, 'src', 'assets');
const destDir = path.join(__dirname, 'src', 'public');

const publicJSPath = path.join(destDir, 'js');
const publicCSSPath = path.join(destDir, 'css');

const copyFile = (srcPath) => {
  const relativePath = path.relative(sourceDir, srcPath);
  if (relativePath.startsWith('js')) buildJS();
  if (relativePath.startsWith('css')) buildCSS();
};

const removeFile = (srcPath) => {
  const relativePath = path.relative(sourceDir, srcPath);
  const destPath = path.join(destDir, relativePath.replace('.ts', '.js'));
  fs.remove(destPath)
    .then(() => console.log(`Removed: ${destPath}`))
    .catch((err) => console.error(`Error removing ${destPath}:`, err));

  if (relativePath.startsWith('js')) buildJS();
  if (relativePath.startsWith('css')) buildCSS();
};

const ensureDirExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const getTSFiles = () => {
  const jsPath = path.join(sourceDir, 'js')
  return fs.readdirSync(jsPath)
    .filter(file => file.endsWith('.ts'))
    .map(file => path.join(jsPath, file))
    .join(' ');
};

const buildJS = () => {
  ensureDirExists(publicJSPath);
  const tsFiles = getTSFiles(publicJSPath);
  if (!tsFiles) {
    console.log('No TypeScript files found, skipping JS build.');
    return;
  }
  exec(`esbuild ${sourceDir}/js/*ts --bundle --outdir=${destDir}/js`, (err, stdout, stderr) => {
    if (err) console.error(`Error rebuilding JS: ${stderr}`);
    // else console.log('JavaScript updated successfully.');
  });
};

const buildCSS = () => {
  ensureDirExists(publicCSSPath);
  exec(`postcss ${sourceDir}/css/*.css --dir ${destDir}/css`, (err, stdout, stderr) => {
    if (err) console.error(`Error rebuilding CSS: ${stderr}`);
    // else console.log('CSS updated successfully.');
  });
};

const watcher = chokidar.watch(sourceDir, {
  persistent: true,
  ignoreInitial: false,
  awaitWriteFinish: {
    stabilityThreshold: 100,
    pollInterval: 10,
  },
});

watcher
  .on('add', copyFile)
  .on('change', copyFile)
  .on('unlink', removeFile)
  .on('error', (error) => console.error(`Watcher error: ${error}`))
  .on('ready', () => console.log('Initial scan complete. Ready for changes.'));