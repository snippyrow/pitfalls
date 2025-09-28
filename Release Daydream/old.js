
// Full-page high-DPI-aware rootCanvas with resize handling
const rootCanvas = document.getElementById('canvas');
const ctx = rootCanvas.getContext('2d');


function resizerootCanvas() {
    const dpr = window.devicePixelRatio || 1;

    rootCanvas.style.width = window.innerWidth + 'px';
    rootCanvas.style.height = window.innerHeight + 'px';

    rootCanvas.width = Math.floor(window.innerWidth * dpr);
    rootCanvas.height = Math.floor(window.innerHeight * dpr);

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}


// Example animation that adapts to size
let t = 0;
function draw() {
    const w = rootCanvas.width / (window.devicePixelRatio || 1);
    const h = rootCanvas.height / (window.devicePixelRatio || 1);


    // Clear
    ctx.clearRect(0, 0, w, h);


    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, `hsl(${(t * 10) % 360} 70% 20%)`);
    grad.addColorStop(1, `hsl(${(t * 10 + 120) % 360} 70% 30%)`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);


    // Moving circles
    for (let i = 0; i < 8; i++) {
    const cx = w * (0.1 + 0.8 * ((Math.sin(t * 0.001 + i) + 1) / 2));
    const cy = h * (0.1 + 0.8 * ((Math.cos(t * 0.001 * (i + 1)) + 1) / 2));
    const r = (Math.min(w, h) / 10) * (0.4 + 0.6 * Math.abs(Math.sin(t * 0.002 + i)));
    ctx.beginPath();
    ctx.globalAlpha = 0.22;
    ctx.fillStyle = `hsl(${(i * 40 + t * 0.03) % 360} 80% 60%)`;
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    }


    // Foreground label
    ctx.globalAlpha = 1;
    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    ctx.font = Math.max(14, Math.round(Math.min(w, h) * 0.03)) + 'px system-ui, -apple-system, Segoe UI, Roboto';
    ctx.textAlign = 'center';
    ctx.fillText('Full-page rootCanvas — resize the window', w / 2, h - 24);


    t++;
    requestAnimationFrame(draw);
    }


// Initialize
window.addEventListener('resize', resizerootCanvas, {passive: true});
resizerootCanvas();
requestAnimationFrame(draw);


// Optional: expose rootCanvas for debugging
window.__FULLPAGE_rootCanvas__ = rootCanvas;
