import fs from 'node:fs';
import { spawn } from 'node:child_process';

const browser = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', [
  '--headless=new', '--disable-gpu', '--no-first-run', '--remote-debugging-port=0',
  '--user-data-dir=node_modules/.cache/inspect-profile', 'about:blank'
], { windowsHide: true, stdio: ['ignore', 'ignore', 'pipe'] });

let stderr = '';
browser.stderr.on('data', async chunk => {
  stderr += chunk;
  const match = stderr.match(/DevTools listening on (ws:\/\/[^\s]+)/);
  if (match) {
    const ws = new WebSocket(match[1]);
    await new Promise(r => ws.addEventListener('open', r, { once: true }));
    let id = 0;
    const send = (method, params = {}) => new Promise(res => {
      const curId = ++id;
      const handler = e => {
        const msg = JSON.parse(e.data);
        if (msg.id === curId) { ws.removeEventListener('message', handler); res(msg.result); }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: curId, method, params }));
    });

    const target = await send('Target.createTarget', { url: 'about:blank' });
    const session = await send('Target.attachToTarget', { targetId: target.targetId, flatten: true });
    const cdp = (m, p) => send(m, { ...p, sessionId: session.sessionId });

    await cdp('Page.enable');
    await cdp('Emulation.setDeviceMetricsOverride', { width: 1536, height: 730, deviceScaleFactor: 1, mobile: false });
    await cdp('Page.navigate', { url: 'http://localhost:5173/' });
    await new Promise(r => setTimeout(r, 2000));

    const res = await cdp('Runtime.evaluate', {
      expression: `
        (() => {
          const s = document.querySelector('.public-search');
          const i = document.querySelector('.public-search input');
          const b = document.querySelector('.public-search button');
          const a = document.querySelector('.a_search');
          const l = document.querySelector('.btn_login');
          const g = document.querySelector('.toolbar-right-group');
          return JSON.stringify({
            search: s ? { x: s.offsetLeft, w: s.offsetWidth, right: s.offsetLeft + s.offsetWidth } : null,
            searchInput: i ? { x: i.offsetLeft, w: i.offsetWidth, right: i.offsetLeft + i.offsetWidth } : null,
            searchBtn: b ? { x: b.offsetLeft, w: b.offsetWidth, right: b.offsetLeft + b.offsetWidth, pos: getComputedStyle(b).position } : null,
            advSearch: a ? { x: a.offsetLeft, w: a.offsetWidth, margin: getComputedStyle(a).margin, pad: getComputedStyle(a).padding } : null,
            loginBtn: l ? { x: l.offsetLeft, w: l.offsetWidth } : null,
            rightGroup: g ? { w: g.offsetWidth, gap: getComputedStyle(g).gap } : null
          });
        })()
      `,
      returnByValue: true
    });
    console.log('MEASUREMENTS:', res.result.value);
    browser.kill();
    process.exit(0);
  }
});
