import { spawn } from 'node:child_process';

const vite = spawn('npx', ['vite'], { stdio: 'inherit', shell: true });
const electronChain = spawn(
  'npx',
  [
    'cross-env',
    'ELECTRON_START_URL=http://localhost:5173',
    'nodemon',
    '--watch',
    'main.cjs',
    '--watch',
    'preload.cjs',
    '--watch',
    'db.cjs',
    '--watch',
    'menu.cjs',
    '--exec',
    'electron',
    '.',
  ],
  { stdio: 'inherit', shell: true }
);

const stop = (signal) => {
  vite.kill(signal);
};

electronChain.on('exit', (code) => {
  stop('SIGINT');
});

process.on('SIGINT', () => {
  electronChain.kill('SIGINT');
  vite.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  electronChain.kill('SIGTERM');
  vite.kill('SIGTERM');
  process.exit(0);
});
