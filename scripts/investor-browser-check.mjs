import { spawn } from 'node:child_process';
import { mkdtemp, readFile, mkdir, writeFile, readdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import { inspectHtml } from './site-audit.mjs';

const base = process.argv[2] ?? 'http://localhost:3100';
const output = resolve(process.argv[3] ?? 'reports/browser-phase2c/local');
const baseline = process.argv.includes('--baseline');
const profile = await mkdtemp(join(tmpdir(), 'temacore-investor-qa-'));
await mkdir(output, { recursive: true });
await mkdir(join(output, 'downloads'), { recursive: true });
const browser = spawn(process.env.CHROME_PATH ?? 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', ['--headless=new', '--disable-gpu', '--no-first-run', '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank'], { windowsHide: true, stdio: 'ignore' });
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
let socket;
let browserError;
browser.on('error', e => { browserError = e; });
try {
  let port;
  for (let i = 0; i < 150; i++) {
    if (browserError) throw browserError;
    try { port = (await readFile(join(profile, 'DevToolsActivePort'), 'utf8')).split('\n')[0]; break; } catch { await sleep(200); }
  }
  assert.ok(port, 'Browser debug port available');
  const target = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' })).json();
  socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((res, rej) => { socket.onopen = res; socket.onerror = rej; });
  const pending = new Map();
  let seq = 0;
  const runtimeErrors = [], consoleErrors = [], failedRequests = [], events = [];
  const send = (method, params = {}) => new Promise((res, rej) => {
    const id = ++seq;
    const timer = setTimeout(() => { pending.delete(id); rej(new Error(`CDP timeout: ${method}`)); }, 60000);
    pending.set(id, { res, rej, timer });
    socket.send(JSON.stringify({ id, method, params }));
  });
  socket.onclose = () => { for (const p of pending.values()) { clearTimeout(p.timer); p.rej(new Error('Browser closed')); } pending.clear(); };
  socket.onmessage = e => {
    const m = JSON.parse(e.data);
    if (m.id) { const p = pending.get(m.id); if (p) { clearTimeout(p.timer); pending.delete(m.id); if (m.error) p.rej(new Error(m.error.message)); else p.res(m.result); } }
    if (m.method === 'Runtime.exceptionThrown') runtimeErrors.push(m.params.exceptionDetails.text);
    if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') consoleErrors.push(m.params.args.map(a => a.value ?? a.description).join(' '));
    if (m.method === 'Network.responseReceived' && m.params.response.status >= 400) failedRequests.push({ url: m.params.response.url, status: m.params.response.status });
    if (m.method === 'Fetch.requestPaused') {
      const request = m.params.request;
      if (request.postData) { const { eventName, slideNumber } = JSON.parse(request.postData); events.push({ eventName, slideNumber }); }
      // Verify emitted events without polluting live analytics or contacting external services.
      void send('Fetch.fulfillRequest', { requestId: m.params.requestId, responseCode: 200, responseHeaders: [{ name: 'Content-Type', value: 'application/json' }], body: Buffer.from('{"ok":true}').toString('base64') });
    }
  };
  const evaluate = async (expression, userGesture = false) => {
    const r = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true, userGesture });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description ?? r.exceptionDetails.text);
    return r.result.value;
  };
  const waitFor = async (expression, label) => {
    for (let i = 0; i < 150; i++) { if (await evaluate(expression)) return; await sleep(200); }
    throw new Error('Timed out: ' + label);
  };
  const active = () => evaluate("Number(document.querySelector('[role=progressbar]')?.getAttribute('aria-valuenow'))");
  const loaded = n => waitFor(`Number(document.querySelector('[role=progressbar]')?.getAttribute('aria-valuenow')) === ${n} && (()=>{const i=document.querySelector('#investor-deck-slide-stage img');return i?.complete && i.naturalWidth>0 && i.src.includes('slide-${String(n).padStart(2, '0')}')})()`, 'slide ' + n);
  const click = label => evaluate(`document.querySelector('button[aria-label=${JSON.stringify(label)}]').click()`, true);
  const key = async (name, code = name) => {
    await evaluate('document.activeElement?.blur()');
    await send('Input.dispatchKeyEvent', { type: 'keyDown', key: name, code });
    await send('Input.dispatchKeyEvent', { type: 'keyUp', key: name, code });
  };
  const screenshot = async (name, stageOnly = false) => {
    const selector = stageOnly ? '#investor-deck-slide-stage' : '[data-testid=investor-deck-fullscreen-root]';
    const rect = await evaluate(`(()=>{const r=document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect();return {x:r.x+scrollX,y:r.y+scrollY,width:r.width,height:r.height,scale:1}})()`);
    const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: rect });
    await writeFile(join(output, name + '.png'), Buffer.from(shot.data, 'base64'));
  };
  await send('Page.enable'); await send('Runtime.enable'); await send('Network.enable');
  await send('Fetch.enable', { patterns: [{ urlPattern: '*/api/investors/events', requestStage: 'Request' }] });
  await send('Browser.setDownloadBehavior', { behavior: 'allow', downloadPath: join(output, 'downloads'), eventsEnabled: true });
  const response = await fetch(base + '/investors');
  assert.equal(response.status, 200);
  const html = await response.text();
  const metadata = inspectHtml(html);
  const getMeta = name => [...html.matchAll(/<meta\b[^>]*>/g)].map(m => m[0]).find(m => m.includes(`="${name}"`));
  assert.deepEqual(metadata.canonicals, ['https://www.temacore.com/investors']);
  assert.ok(metadata.robots.some(r => r.includes('noindex') && r.includes('noarchive')));
  if (!baseline) {
    assert.ok(metadata.title.includes('Vertical AI'));
    assert.ok(getMeta('og:image').includes('/logo.png'));
    assert.ok(getMeta('twitter:image').includes('/logo.png'));
    for (const name of ['og:title', 'og:description', 'twitter:title', 'twitter:description']) assert.ok(getMeta(name));
    assert.ok(!/\$1\.25|\$3[kK]|monthly company revenue/.test(metadata.title + metadata.description));
  }
  const records = [];
  const widths = process.env.INVESTOR_QA_WIDTHS ? process.env.INVESTOR_QA_WIDTHS.split(',').map(Number) : baseline ? [1440, 390] : [1440, 1280, 1024, 768, 390, 375];
  for (const width of widths) {
    const height = width < 768 ? 844 : 1000;
    await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 768 });
    await send('Emulation.setTouchEmulationEnabled', { enabled: width <= 768, maxTouchPoints: 1 });
    await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: width === 375 ? 'reduce' : 'no-preference' }] });
    await send('Page.navigate', { url: base + '/investors?qa=' + Date.now() });
    await loaded(1);
    await evaluate("document.querySelector('#investor-presentation').scrollIntoView({block:'center'})");
    await sleep(300);
    const geometry = await evaluate(`(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,controls:[...document.querySelectorAll('.investor-deck-normal-controls button')].map(b=>({label:b.getAttribute('aria-label'),width:b.getBoundingClientRect().width,height:b.getBoundingClientRect().height})),focusOutline:getComputedStyle(document.querySelector('.investor-deck-normal-controls button')).outlineStyle}))()`);
    assert.ok(geometry.scrollWidth <= geometry.width, `No horizontal overflow at ${width}`);
    assert.ok(geometry.controls.every(b => b.label && b.width >= 44 && b.height >= 44));
    await screenshot(`${width}-viewer`);
    const slides = [];
    for (let n = 1; n <= (baseline ? 1 : 15); n++) {
      await loaded(n);
      const image = await evaluate(`(()=>{const i=document.querySelector('#investor-deck-slide-stage img'),r=i.getBoundingClientRect(),s=i.parentElement.getBoundingClientRect();return {src:i.getAttribute('src'),naturalWidth:i.naturalWidth,naturalHeight:i.naturalHeight,alt:i.alt,objectFit:getComputedStyle(i).objectFit,width:r.width,height:r.height,frameWidth:s.width,frameHeight:s.height}})()`);
      assert.equal(image.objectFit, 'contain');
      assert.ok(Math.abs(image.width / image.height - 16 / 9) < 0.01);
      if (!baseline) { assert.equal(image.naturalWidth, 2560); assert.equal(image.naturalHeight, 1440); assert.ok(image.src.includes('/2026-c195ba3c/')); }
      await screenshot(`${width}-slide-${String(n).padStart(2, '0')}`, true);
      slides.push({ slide: n, ...image });
      if (!baseline && n < 15) await click('Next slide');
    }
    if (!baseline) {
      assert.equal(await evaluate("document.querySelector('button[aria-label=\"Next slide\"]').disabled"), true);
      await key('Home'); await loaded(1);
      await key('ArrowRight'); await loaded(2);
      await key('ArrowLeft'); await loaded(1);
      await key(' ', 'Space'); await loaded(2);
      await key('End'); await loaded(15);
      await click('Restart presentation at slide 1'); await loaded(1);
      await click('Open slide thumbnails');
      await waitFor("document.querySelector('button[aria-label=\"Open slide 8\"]') !== null", 'thumbnail panel');
      assert.equal(await evaluate("document.querySelectorAll('button[aria-label^=\"Open slide \"]:not([aria-label=\"Open slide thumbnails\"])').length"), 15);
      await click('Open slide 8'); await loaded(8);
      await click('Open slide thumbnails'); await key('Escape');
      assert.equal(await evaluate("document.querySelector('#investor-slide-overview-title') === null"), true);
      if (width <= 768) {
        await evaluate("document.querySelector('#investor-deck-slide-stage').scrollIntoView({block:'center'})");
        await sleep(300);
        const box = await evaluate("(()=>{const r=document.querySelector('#investor-deck-slide-stage').getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height}})()");
        console.log('Swipe geometry', width, JSON.stringify(box));
        await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: box.x + box.w * 0.8, y: box.y + box.h / 2 }] });
        await send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: box.x + box.w * 0.2, y: box.y + box.h / 2 }] });
        await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
        await loaded(9);
      }
      if (width === 1440) {
        await click('Open full screen presentation');
        await waitFor('!!document.fullscreenElement', 'fullscreen');
        await screenshot('1440-fullscreen');
        await key('Escape'); await waitFor('!document.fullscreenElement', 'exit fullscreen');
        await click('Restart presentation at slide 1'); await loaded(1);
        await click('Start autoplay'); await loaded(2); await click('Pause autoplay');
        const paused = await active(); await sleep(8500); assert.equal(await active(), paused);
        await key('End'); await loaded(15);
        await click('Download investor presentation PDF');
        let files = [];
        for (let i = 0; i < 100; i++) { files = await readdir(join(output, 'downloads')); if (files.includes('TEMACORE_Investor_Deck_2026.pdf')) break; await sleep(200); }
        assert.ok(files.includes('TEMACORE_Investor_Deck_2026.pdf'));
        const download = await readFile(join(output, 'downloads', 'TEMACORE_Investor_Deck_2026.pdf'));
        assert.equal(createHash('sha256').update(download).digest('hex'), 'c195ba3c4d6f0f60e74434fd9505b2b077661e9f6d83f3adb46453d33db40f61');
        await evaluate(`(()=>{const a=document.querySelector('#investor-presentation a[href="mailto:info@temacore.com"]');if(!a)throw Error('Contact CTA missing');a.addEventListener('click',e=>e.preventDefault(),{once:true});a.click()})()`, true);
      }
    }
    records.push({ width, height, reducedMotion: width === 375, geometry, slides, navigationPassed: !baseline });
    await writeFile(join(output, 'results.json'), JSON.stringify({ base, baseline, records, metadata, runtimeErrors, consoleErrors, failedRequests, events }, null, 2));
    console.log(`PASS ${width}px: ${slides.length} slides, controls, geometry${baseline ? '' : ', keyboard, thumbnails'}`);
  }
  assert.deepEqual(runtimeErrors, []); assert.deepEqual(consoleErrors, []); assert.deepEqual(failedRequests, []);
  if (!baseline && widths.includes(1440)) for (const name of ['investor_deck_page_view', 'investor_deck_started', 'investor_deck_slide_viewed', 'investor_deck_halfway_reached', 'investor_deck_completed', 'investor_deck_pdf_downloaded', 'investor_deck_contact_clicked', 'investor_deck_fullscreen_opened', 'investor_deck_autoplay_started']) assert.ok(events.some(e => e.eventName === name), name);
  console.log('PASS investor browser QA');
  await send('Browser.close').catch(() => {});
} finally {
  socket?.close();
  if (browser.exitCode === null) browser.kill();
}
