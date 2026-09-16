import { execSync } from 'node:child_process';

const port = 3000;

function killPort(portNumber) {
  try {
    execSync(`for /f "usebackq" %p in (\`netstat -ano -p tcp ^| findstr :${portNumber}\`) do @echo %p`, { stdio: 'pipe' });
  } catch {
    return;
  }

  try {
    const output = execSync(`netstat -ano -p tcp | findstr :${portNumber}`, { encoding: 'utf8' });
    const lines = output.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    const pids = new Set();

    for (const line of lines) {
      const match = line.match(/\s+(\d+)\s*$/);
      if (match) pids.add(match[1]);
    }

    for (const pid of pids) {
      try {
        execSync(`taskkill /PID ${pid} /F`, { stdio: 'ignore' });
      } catch {
        // ignore process cleanup failures
      }
    }
  } catch {
    // ignore failures during port cleanup
  }
}

killPort(port);

const { spawn } = await import('node:child_process');

const child = spawn(
  process.platform === 'win32' ? 'npx.cmd' : 'npx',
  ['next', 'dev', '--port', String(port)],
  {
    stdio: 'inherit',
    shell: true,
  }
);

child.on('exit', (code) => {
  process.exit(code ?? 0);
});