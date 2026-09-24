import { spawn } from 'node:child_process';
import { mkdtemp, readFile, mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const base = process.argv[2] ?? 'https://www.temacore.com';
const output = process.argv[3] ?? 'reports/browser';
const executable = process.argv[4] ?? process.env.CHROME_PATH ?? 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const profile = await mkdtemp(join(tmpdir(), 'temacore-browser-check-'));
await mkdir(output, { recursive: true });
const browser = spawn(executable, ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank'], { windowsHide: true, stdio: 'ignore' });
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
let socket;
let browserError;
browser.on('error', error => { browserError = error; });
try {
  let port;
  for (let i = 0; i < 100; i++) {
    if (browserError) throw browserError;
    try { port = (await readFile(join(profile, 'DevToolsActivePort'), 'utf8')).split('\n')[0]; break; } catch { await sleep(200); }
  }
  if (!port) throw new Error('Browser did not expose its debugging port');
  const target = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' })).json();
  socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
  let seq = 0;
  const pending = new Map();
  const errors = [];
  socket.onclose = () => {
    for (const item of pending.values()) { clearTimeout(item.timeout); item.reject(new Error("Browser connection closed")); }
    pending.clear();
  };
  socket.onmessage = event => {
    const msg = JSON.parse(event.data);
    if (msg.id) {
      const item = pending.get(msg.id);
      if (item) { clearTimeout(item.timeout); pending.delete(msg.id); if (msg.error) item.reject(new Error(msg.error.message)); else item.resolve(msg.result); }
    }
    if (msg.method === 'Runtime.exceptionThrown') errors.push(msg.params.exceptionDetails.text);
  };
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++seq;
    const timeout = setTimeout(() => { pending.delete(id); reject(new Error(`CDP timeout: ${method}`)); }, 60000);
    pending.set(id, { resolve, reject, timeout });
    socket.send(JSON.stringify({ id, method, params }));
  });
  await send('Page.enable');
  await send('Runtime.enable');
  const records = [];
  for (const viewport of [{ name: 'desktop', width: 1440, height: 1000, mobile: false }, { name: 'mobile', width: 390, height: 844, mobile: true }]) {
    await send('Emulation.setDeviceMetricsOverride', { width: viewport.width, height: viewport.height, deviceScaleFactor: 1, mobile: viewport.mobile });
    for (const path of (process.argv[5]?.split(',') ?? ['/'])) {
      errors.length = 0;
      const url = new URL(path, base);
      url.searchParams.set('verification', Date.now());
      const navigation = await send('Page.navigate', { url: url.href });
      if (navigation.errorText) throw new Error(navigation.errorText);
      let loaded = false;
      for (let i = 0; i < 100; i++) {
        const ready = await send('Runtime.evaluate', { expression: `location.pathname === ${JSON.stringify(path)} && document.readyState === 'complete' && !!document.querySelector('main h1')`, returnByValue: true });
        if (ready.result.value) { loaded = true; break; }
        await sleep(200);
      }
      if (!loaded) throw new Error('Navigation did not complete: ' + path);
      await send('Runtime.evaluate', { expression: 'Promise.race([document.fonts.ready, new Promise(resolve => setTimeout(resolve, 5000))])', awaitPromise: true });
      await sleep(700);
      const data = await send('Runtime.evaluate', { expression: `JSON.stringify({title:document.title,h1:document.querySelector('main h1').innerText,width:innerWidth,scrollWidth:document.documentElement.scrollWidth,canonical:[...document.querySelectorAll('link[rel=canonical]')].map(e=>e.href),hero:document.querySelector('main section').innerText})`, returnByValue: true });
      const record = { viewport: viewport.name, path, ...JSON.parse(data.result.value), runtimeErrors: [...errors] };
      records.push(record);
      const screenshot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
      const name = path === '/' ? 'home' : path.replaceAll('/', '-').slice(1);
      await writeFile(join(output, `${viewport.name}-${name}.png`), Buffer.from(screenshot.data, 'base64'));
      await writeFile(join(output, 'results.json'), JSON.stringify({ checkedAt: new Date().toISOString(), base, records }, null, 2) + '\n');
      console.log(`${viewport.name} ${path}: ${record.scrollWidth <= record.width ? 'no horizontal overflow' : 'OVERFLOW'}, ${errors.length} runtime errors`);
    }
  }
  await writeFile(join(output, 'results.json'), JSON.stringify({ checkedAt: new Date().toISOString(), base, records }, null, 2) + '\n');
  if (records.some(r => r.scrollWidth > r.width || r.runtimeErrors.length)) process.exitCode = 1;
  await send('Browser.close').catch(() => {});
} finally {
  socket?.close();
  if (browser.exitCode === null) browser.kill();
}
