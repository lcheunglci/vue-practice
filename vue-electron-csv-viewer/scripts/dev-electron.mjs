import { spawn } from 'node:child_process';
import { watch } from 'node:fs';
import { resolve } from 'node:path';

const vite = spawn('npx', ['vite'], { stdio: 'inherit', shell: true });

const startElectron = () =>
  spawn(
    'npx',
    ['cross-env', 'ELECTRON_START_URL=http://localhost:5173', 'electron', '.'],
    { stdio: 'inherit', shell: true }
  );

let electron = startElectron();
let restarting = false;

const killVite = (signal) => {
  try { vite.kill(signal); } catch {}
};

const killElectron = () => {
  try { electron.kill('SIGTERM'); } catch {}
};

// When Electron window closes, kill Vite and exit the script
electron.on('exit', () => {
  if (restarting) return;
  killVite('SIGINT');
  process.exit(0);
});

electron.on('error', (err) => {
  console.error('Electron failed to start:', err);
});

process.on('SIGINT', () => {
  restarting = true;
  killElectron();
  killVite('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  killElectron();
  killVite('SIGTERM');
  process.exit(0);
});

// Watch Electron main-process files to auto-restart Electron (not Vite)
const watchedFiles = ['main.cjs', 'preload.cjs', 'db.cjs', 'menu.cjs'];
const watcher = watch(
  resolve('.'),
  { persistent: false, recursive: false },
  () => {
    restarting = true;
    killElectron();
    setTimeout(() => {
      restarting = false;
      electron = startElectron();
      electron.on('exit', () => {
        if (restarting) return;
        killVite('SIGINT');
        process.exit(0);
      });
    }, 300);
  }
);

watcher.on('error', () => {});

process.on('exit', () => {
  try { watcher.close(); } catch {}
});
