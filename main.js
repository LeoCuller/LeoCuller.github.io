document.getElementById('copy')?.addEventListener('click', function () {
  const btn = this, txt = document.getElementById('email').textContent;
  const done = () => { btn.textContent = 'Copiado'; setTimeout(() => btn.textContent = 'Copiar e-mail', 1600); };
  const pick = () => { const r = document.createRange(); r.selectNodeContents(document.getElementById('email')); const s = getSelection(); s.removeAllRanges(); s.addRange(r); btn.textContent = 'Selecionado, use Ctrl+C'; };
  try { navigator.clipboard.writeText(txt).then(done, pick); } catch (e) { pick(); }
});
// Mapa de rotas do hero: um grafo de ruas com pedidos; um caminho mais curto (Dijkstra) é desenhado entre dois pedidos.
(function () {
  const cv = document.getElementById('map');
  if (!cv) return;
  const ctx = cv.getContext('2d');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let nodes = [], edges = [], adj = [], path = [], t = 0, raf = 0, w = 0, h = 0;
  let seed = 7;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();

  function build() {
    const r = cv.getBoundingClientRect(); w = r.width; h = r.height;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seed = 7; nodes = []; edges = [];
    const step = 70, cols = Math.ceil(w / step) + 1, rows = Math.ceil(h / step) + 1;
    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++)
      nodes.push({ x: x * step + (rnd() - .5) * 34, y: y * step + (rnd() - .5) * 34 });
    adj = nodes.map(() => []);
    const add = (a, b) => { const d = Math.hypot(nodes[a].x - nodes[b].x, nodes[a].y - nodes[b].y); edges.push([a, b]); adj[a].push([b, d]); adj[b].push([a, d]); };
    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
      const i = y * cols + x;
      if (x < cols - 1 && rnd() > .12) add(i, i + 1);
      if (y < rows - 1 && rnd() > .12) add(i, i + cols);
      if (x < cols - 1 && y < rows - 1 && rnd() > .82) add(i, i + cols + 1);
    }
    // origem perto do canto direito superior, destino no canto direito inferior (o texto fica à esquerda)
    const near = (px, py) => nodes.reduce((b, n, i) => Math.hypot(n.x - px, n.y - py) < Math.hypot(nodes[b].x - px, nodes[b].y - py) ? i : b, 0);
    path = dijkstra(near(w * .62, h * .18), near(w * .92, h * .85));
  }

  function dijkstra(s, g) {
    const dist = nodes.map(() => Infinity), prev = nodes.map(() => -1), done = new Set();
    dist[s] = 0;
    while (true) {
      let u = -1;
      for (let i = 0; i < nodes.length; i++) if (!done.has(i) && (u < 0 || dist[i] < dist[u])) u = i;
      if (u < 0 || dist[u] === Infinity || u === g) break;
      done.add(u);
      for (const [v, d] of adj[u]) if (dist[u] + d < dist[v]) { dist[v] = dist[u] + d; prev[v] = u; }
    }
    const p = []; for (let v = g; v >= 0; v = prev[v]) p.unshift(v);
    return p[0] === s ? p : [];
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    ctx.globalAlpha = .55; ctx.strokeStyle = css('--line'); ctx.lineWidth = 1;
    ctx.beginPath(); for (const [a, b] of edges) { ctx.moveTo(nodes[a].x, nodes[a].y); ctx.lineTo(nodes[b].x, nodes[b].y); } ctx.stroke();
    ctx.globalAlpha = 1;
    // rota percorrida até t (0..1)
    const segs = path.length - 1, k = Math.max(0, Math.min(1, t)) * segs;
    ctx.strokeStyle = css('--route'); ctx.lineWidth = 3; ctx.lineJoin = ctx.lineCap = 'round';
    ctx.beginPath();
    for (let i = 0; i <= Math.floor(k) && i < path.length; i++) { const n = nodes[path[i]]; i ? ctx.lineTo(n.x, n.y) : ctx.moveTo(n.x, n.y); }
    let head = path.length ? nodes[path[0]] : null;
    if (k < segs && path.length > 1) {
      const a = nodes[path[Math.floor(k)]], b = nodes[path[Math.floor(k) + 1]], f = k - Math.floor(k);
      head = { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f }; ctx.lineTo(head.x, head.y);
    } else if (path.length) head = nodes[path[path.length - 1]];
    ctx.stroke();
    // pedidos (origem e destino) e o motoboy
    ctx.fillStyle = css('--accent');
    for (const i of [path[0], path[path.length - 1]]) if (i !== undefined) { ctx.beginPath(); ctx.arc(nodes[i].x, nodes[i].y, 6, 0, 7); ctx.fill(); }
    if (head) { ctx.fillStyle = css('--surface'); ctx.strokeStyle = css('--route'); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(head.x, head.y, 5, 0, 7); ctx.fill(); ctx.stroke(); }
  }

  function loop() {
    t += 0.004; if (t > 1.35) t = 0;
    draw(); raf = requestAnimationFrame(loop);
  }
  function start() {
    cancelAnimationFrame(raf); build();
    if (reduce) { t = 1; draw(); } else { t = 1; draw(); t = 0; raf = requestAnimationFrame(loop); }
  }
  start();
  let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(start, 150); });
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', draw);
})();
