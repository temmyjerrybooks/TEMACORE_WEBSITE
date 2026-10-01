import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

export function runVercelBuild(environment, run) {
  if (!['production', 'preview', 'development'].includes(environment.VERCEL_ENV)) {
    throw new Error('Vercel environment is missing; cannot safely select database setup.');
  }
  if (environment.VERCEL_ENV === 'production') {
    // A failed migration or runtime connection check must prevent deployment.
    for (const script of ['scripts/db-migrate.mjs', 'scripts/db-check.mjs']) {
      const status = run([script]);
      if (status !== 0) return status;
    }
  }
  // Preview and development deployments never modify a connected database.
  return run(['node_modules/next/dist/bin/next', 'build', '--webpack']);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    process.exitCode = runVercelBuild(process.env, args => {
      const result = spawnSync(process.execPath, args, { stdio: 'inherit', windowsHide: true });
      if (result.error) console.error('Unable to start a required build step.');
      return result.status ?? 1;
    });
  } catch {
    console.error('Production build setup failed. Check the Vercel environment configuration.');
    process.exitCode = 1;
  }
}
