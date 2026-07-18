const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');
const html = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');

// Extract JS asset
const jsMatch = html.match(/assets\/index-[^"]+\.js/);
if (!jsMatch) { console.log('NO JS FOUND'); process.exit(1); }
const jsFile = path.join(distDir, jsMatch[0]);

const dom = new JSDOM(html, {
  runScripts: 'outside-only',
  pretendToBeVisual: true,
  url: 'http://localhost/',
});
const { window } = dom;

// shims
window.matchMedia = window.matchMedia || function() { return { matches: false, addEventListener(){}, removeEventListener(){}, addListener(){}, removeListener(){} }; };
window.IntersectionObserver = window.IntersectionObserver || class { observe(){} disconnect(){} unobserve(){} };
window.crypto = window.crypto || require('crypto').webcrypto;
window.requestAnimationFrame = window.requestAnimationFrame || ((cb)=>setTimeout(cb,0));
window.cancelAnimationFrame = window.cancelAnimationFrame || ((id)=>clearTimeout(id));
window.scrollTo = window.scrollTo || function(){};
global.window = window;
global.document = window.document;
global.navigator = window.navigator;
global.HTMLElement = window.HTMLElement;
global.localStorage = window.localStorage;

const errors = [];
window.addEventListener('error', e => errors.push('WINDOW ERROR: ' + (e.error ? e.error.stack : e.message)));
const origError = console.error;
console.error = (...a) => { errors.push('CONSOLE.ERROR: ' + a.map(String).join(' ')); };

try {
  const code = fs.readFileSync(jsFile, 'utf8');
  const fn = new window.Function(code);
  fn.call(window);
} catch (e) {
  errors.push('THROW: ' + (e.stack || e.message));
}

setTimeout(() => {
  const root = window.document.getElementById('root');
  console.log('ROOT INNER LENGTH:', root ? root.innerHTML.length : 'NO ROOT');
  console.log('ROOT SNIPPET:', root ? root.innerHTML.slice(0,200) : '');
  console.log('=== ERRORS ===');
  console.log(errors.join('\n---\n') || 'NONE');
}, 1000);
