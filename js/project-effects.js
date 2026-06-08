/**
 * Reactive project backgrounds for project cards and detail-page heroes.
 * Vanilla canvas, no network access, safe for file:// and static hosting.
 */
(function () {
  'use strict';

  var TWO_PI = Math.PI * 2;
  var REDUCED_MOTION = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var FX = {
    controlchaos: drawControlChaos,
    evobrain: drawEvoBrain,
    iargos: drawIargos,
    lab: drawLab,
    kairos: drawKairos
  };

  function readSize(canvas, host, fallbackW, fallbackH) {
    var w = host.offsetWidth || fallbackW || 320;
    var h = host.offsetHeight || fallbackH || 220;
    if (canvas.width !== w) canvas.width = w;
    if (canvas.height !== h) canvas.height = h;
    return [w, h];
  }

  function observeResize(host, resize) {
    resize();
    if (window.ResizeObserver) {
      var ro = new ResizeObserver(resize);
      ro.observe(host);
      return;
    }
    window.addEventListener('resize', resize);
  }

  function trackMouse(host, canvas) {
    var mouse = { x: -9999, y: -9999, inside: false };
    function setFromCenter() {
      var r = canvas.getBoundingClientRect();
      mouse.x = r.width * 0.68;
      mouse.y = r.height * 0.42;
      mouse.inside = true;
    }
    host.addEventListener('mousemove', function (e) {
      var r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      mouse.inside = true;
    });
    host.addEventListener('mouseleave', function () {
      mouse.x = -9999;
      mouse.y = -9999;
      mouse.inside = false;
    });
    host.addEventListener('focusin', setFromCenter);
    host.addEventListener('focusout', function () {
      mouse.x = -9999;
      mouse.y = -9999;
      mouse.inside = false;
    });
    return mouse;
  }

  function getProjectIdFromHref(href) {
    var m = (href || '').match(/(?:^|\/)(controlchaos|evobrain|iargos|lab|kairos)\.html(?:[?#].*)?$/);
    return m ? m[1] : null;
  }

  function createCanvas(host, className) {
    var canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    canvas.className = className || '';
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;z-index:2;pointer-events:none;opacity:.72;';
    host.insertBefore(canvas, host.firstChild);
    return canvas;
  }

  function ensureVeil(host, className, styleText) {
    var veil = host.querySelector('.' + className);
    if (veil) return veil;
    veil = document.createElement('div');
    veil.setAttribute('aria-hidden', 'true');
    veil.className = className;
    veil.style.cssText = styleText;
    host.insertBefore(veil, host.children[1] || null);
    return veil;
  }

  function liftReadableChildren(host, canvasClass, veilClass, zIndex) {
    Array.prototype.forEach.call(host.children, function (child) {
      if (child.id === canvasClass || child.classList.contains(canvasClass) || child.classList.contains(veilClass)) return;
      child.style.position = child.style.position || 'relative';
      child.style.zIndex = String(zIndex);
    });
  }

  function attachCard(card) {
    if (card.querySelector('canvas.project-card-fx')) return;
    var pid = getProjectIdFromHref(card.getAttribute('href'));
    if (!pid || !FX[pid]) return;

    if (getComputedStyle(card).position === 'static') card.style.position = 'relative';
    var canvas = createCanvas(card, 'project-card-fx');
    ensureVeil(card, 'project-card-fx-veil',
      'position:absolute;inset:1px;z-index:3;pointer-events:none;border-radius:9px;' +
      'background:linear-gradient(180deg,rgba(8,12,18,.86) 0%,rgba(8,12,18,.64) 42%,rgba(8,12,18,.80) 100%);' +
      'backdrop-filter:blur(2px);-webkit-backdrop-filter:blur(2px);' +
      'mask:linear-gradient(180deg,#000 0%,rgba(0,0,0,.92) 48%,#000 100%);');
    liftReadableChildren(card, 'project-card-fx', 'project-card-fx-veil', 4);
    var ctx = canvas.getContext('2d');
    var size = [0, 0];
    var mouse = trackMouse(card, canvas);
    observeResize(card, function () { size = readSize(canvas, card, 320, 220); });
    FX[pid](ctx, function () { return size; }, mouse, true);
  }

  function attachHero() {
    var canvas = document.getElementById('project-hero-canvas') || document.getElementById('hero-canvas');
    if (!canvas || canvas.dataset.fxAttached === '1') return;

    var bodyPage = document.body ? document.body.getAttribute('data-page') : '';
    if (bodyPage !== 'project-detail') return;

    var path = window.location.pathname || '';
    var pid = getProjectIdFromHref(path);
    if (!pid || !FX[pid]) {
      var tag = document.querySelector('[data-project-tags]');
      pid = tag ? tag.getAttribute('data-project-tags') : null;
    }
    if (!pid || !FX[pid]) return;

    var host = canvas.parentElement;
    canvas.dataset.fxAttached = '1';
    canvas.style.zIndex = '0';
    canvas.style.opacity = '0.68';
    ensureVeil(host, 'project-hero-fx-veil',
      'position:absolute;inset:0;z-index:1;pointer-events:none;' +
      'background:linear-gradient(90deg,rgba(8,12,18,.90) 0%,rgba(8,12,18,.72) 38%,rgba(8,12,18,.34) 70%,rgba(8,12,18,.18) 100%),' +
      'linear-gradient(180deg,rgba(8,12,18,.40) 0%,rgba(8,12,18,.08) 42%,rgba(8,12,18,.52) 100%);' +
      'backdrop-filter:blur(2.5px);-webkit-backdrop-filter:blur(2.5px);' +
      'mask:linear-gradient(90deg,#000 0%,#000 58%,rgba(0,0,0,.72) 78%,rgba(0,0,0,.35) 100%);');
    liftReadableChildren(host, 'project-hero-canvas', 'project-hero-fx-veil', 2);
    var ctx = canvas.getContext('2d');
    var size = [0, 0];
    var mouse = trackMouse(host, canvas);
    observeResize(host, function () { size = readSize(canvas, host, 640, 180); });
    FX[pid](ctx, function () { return size; }, mouse, false);
  }

  function attachCards() {
    document.querySelectorAll('.project-card').forEach(attachCard);
  }

  function bootCardsWhenRendered() {
    var tries = 0;
    function tick() {
      attachCards();
      tries += 1;
      if (!document.querySelector('.project-card') && tries < 40) {
        setTimeout(tick, 80);
      }
    }
    tick();
  }

  function drawControlChaos(ctx, getSize, mouse, compact) {
    var canvas = ctx.canvas;
    var pts = [];
    var palette = [
      [59, 130, 246],
      [0, 180, 255],
      [34, 211, 238],
      [96, 165, 250],
      [20, 184, 166]
    ];

    function init(w, h) {
      pts = [];
      var n = compact ? Math.min(30, Math.max(14, Math.floor(w * h / 5200))) :
        Math.max(28, Math.min(54, Math.floor(w * h / 9000)));
      for (var i = 0; i < n; i++) {
        var color = palette[Math.floor(Math.random() * palette.length)];
        var radius = compact ? Math.random() * 4 + 5 : Math.random() * 5 + 6;
        pts.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.22,
          vy: (Math.random() - 0.5) * 0.22,
          r: radius,
          num: Math.floor(Math.random() * 90) + 1,
          base: Math.random() * 0.16 + 0.34,
          color: color,
          shine: Math.random() * 0.35 + 0.25
        });
      }
    }

    function frame() {
      if (!canvas.isConnected) return;
      var wh = getSize(), w = wh[0], h = wh[1];
      if (!pts.length && w && h) init(w, h);
      ctx.clearRect(0, 0, w, h);

      for (var i = 0; i < pts.length; i++) {
        var p = pts[i];
        var dx = p.x - mouse.x, dy = p.y - mouse.y;
        var d = Math.sqrt(dx * dx + dy * dy);
        var radius = compact ? 82 : 105;
        if (d < radius && d > 1) {
          var f = (radius - d) / radius * 0.48;
          p.vx += dx / d * f;
          p.vy += dy / d * f;
        }
        p.vx *= 0.975; p.vy *= 0.975;
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) { p.x = 0; p.vx = Math.abs(p.vx); }
        if (p.x > w) { p.x = w; p.vx = -Math.abs(p.vx); }
        if (p.y < 0) { p.y = 0; p.vy = Math.abs(p.vy); }
        if (p.y > h) { p.y = h; p.vy = -Math.abs(p.vy); }

        var near = Math.max(0, 1 - d / radius);
        var c = p.color;
        if (near > 0.05) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r + near * 8, 0, TWO_PI);
          ctx.fillStyle = 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + (near * 0.22) + ')';
          ctx.fill();
        }

        var grad = ctx.createRadialGradient(
          p.x - p.r * 0.35, p.y - p.r * 0.4, p.r * 0.15,
          p.x, p.y, p.r
        );
        grad.addColorStop(0, 'rgba(255,255,255,' + (0.34 + p.shine * 0.28) + ')');
        grad.addColorStop(0.3, 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + (p.base + near * 0.28) + ')');
        grad.addColorStop(1, 'rgba(8,20,35,' + (0.22 + near * 0.08) + ')');
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, TWO_PI);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.strokeStyle = 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + (0.38 + near * 0.35) + ')';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.font = (compact ? '8px' : '9px') + ' JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'rgba(235,248,255,' + (0.72 + near * 0.25) + ')';
        ctx.fillText(p.num, p.x, p.y + 0.5);
      }

      for (var a = 0; a < pts.length - 1; a++) {
        for (var b = a + 1; b < pts.length; b++) {
          var lx = pts[a].x - pts[b].x, ly = pts[a].y - pts[b].y;
          var ld = Math.sqrt(lx * lx + ly * ly);
          if (ld < 55) {
            ctx.beginPath();
            ctx.moveTo(pts[a].x, pts[a].y);
            ctx.lineTo(pts[b].x, pts[b].y);
            ctx.strokeStyle = 'rgba(59,130,246,' + (0.36 * (1 - ld / 55)) + ')';
            ctx.lineWidth = 0.9;
            ctx.stroke();
          }
        }
      }
      if (!REDUCED_MOTION) requestAnimationFrame(frame);
    }
    frame();
  }

  function drawEvoBrain(ctx, getSize, mouse, compact) {
    var canvas = ctx.canvas;
    var nodes = [], links = [], t = 0, lastW = 0, lastH = 0;
    var palette = [
      [139, 92, 246],
      [34, 211, 238],
      [96, 165, 250],
      [16, 185, 129],
      [236, 72, 153]
    ];

    function init(w, h) {
      nodes = [];
      links = [];
      lastW = w;
      lastH = h;
      var n = compact ? Math.min(14, Math.max(8, Math.floor(w * h / 11500))) :
        Math.max(16, Math.min(26, Math.floor(w * h / 16000)));
      for (var i = 0; i < n; i++) {
        var color = palette[i % palette.length];
        var shape = i % 3;
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          ox: 0,
          oy: 0,
          vx: (Math.random() - 0.5) * 0.08,
          vy: (Math.random() - 0.5) * 0.08,
          r: Math.random() * 3.2 + (compact ? 3.5 : 4.5),
          phase: Math.random() * TWO_PI,
          act: 0,
          color: color,
          shape: shape
        });
      }

      for (var a = 0; a < nodes.length; a++) {
        var ranked = [];
        for (var b = 0; b < nodes.length; b++) {
          if (a === b) continue;
          var dx = nodes[a].x - nodes[b].x;
          var dy = nodes[a].y - nodes[b].y;
          ranked.push({ i: b, d: Math.sqrt(dx * dx + dy * dy) });
        }
        ranked.sort(function (p, q) { return p.d - q.d; });
        var count = compact ? 2 : 3;
        for (var k = 0; k < Math.min(count, ranked.length); k++) {
          var one = Math.min(a, ranked[k].i);
          var two = Math.max(a, ranked[k].i);
          var exists = links.some(function (l) { return l.a === one && l.b === two; });
          if (!exists) links.push({ a: one, b: two, len: ranked[k].d, tone: Math.random() * 0.3 + 0.7 });
        }
      }
    }

    function drawNode(n, r, alpha) {
      var c = n.color;
      ctx.fillStyle = 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + alpha + ')';
      ctx.strokeStyle = 'rgba(255,255,255,' + (0.18 + n.act * 0.22) + ')';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      if (n.shape === 0) {
        ctx.arc(n.x, n.y, r, 0, TWO_PI);
      } else if (n.shape === 1) {
        ctx.rect(n.x - r * 0.8, n.y - r * 0.8, r * 1.6, r * 1.6);
      } else {
        ctx.moveTo(n.x, n.y - r);
        ctx.lineTo(n.x + r * 0.92, n.y + r * 0.55);
        ctx.lineTo(n.x - r * 0.92, n.y + r * 0.55);
        ctx.closePath();
      }
      ctx.fill();
      ctx.stroke();
    }

    function frame() {
      if (!canvas.isConnected) return;
      t += 0.022;
      var wh = getSize(), w = wh[0], h = wh[1];
      if ((!nodes.length && w && h) || w !== lastW || h !== lastH) init(w, h);
      ctx.clearRect(0, 0, w, h);

      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        n.x += n.vx; n.y += n.vy;
        n.act *= 0.94;
        var dx = n.x - mouse.x, dy = n.y - mouse.y;
        var d = Math.sqrt(dx * dx + dy * dy);
        if (d < 120 && d > 1) {
          var force = (1 - d / 120) * 0.38;
          n.vx += dx / d * force;
          n.vy += dy / d * force;
          n.act = Math.max(n.act, (1 - d / 120) * 0.9);
        }
        n.vx += (Math.random() - 0.5) * 0.008;
        n.vy += (Math.random() - 0.5) * 0.008;
      }

      for (var li = 0; li < links.length; li++) {
        var link = links[li];
        var a = nodes[link.a];
        var b = nodes[link.b];
        var lx = b.x - a.x;
        var ly = b.y - a.y;
        var ld = Math.sqrt(lx * lx + ly * ly) || 1;
        var stretch = (ld - link.len) * 0.0028;
        var fx = lx / ld * stretch;
        var fy = ly / ld * stretch;
        a.vx += fx; a.vy += fy;
        b.vx -= fx; b.vy -= fy;

        var combined = (a.act + b.act) * 0.5;
        a.act = Math.max(a.act, b.act * 0.018);
        b.act = Math.max(b.act, a.act * 0.018);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = 'rgba(170,190,255,' + (0.16 * link.tone + combined * 0.42) + ')';
        ctx.lineWidth = 0.7 + combined * 1.1;
        ctx.stroke();
      }

      for (var nidx = 0; nidx < nodes.length; nidx++) {
        var nodeRef = nodes[nidx];
        nodeRef.vx *= 0.94;
        nodeRef.vy *= 0.94;
        if (nodeRef.x < 12) { nodeRef.x = 12; nodeRef.vx = Math.abs(nodeRef.vx) * 0.6; }
        if (nodeRef.x > w - 12) { nodeRef.x = w - 12; nodeRef.vx = -Math.abs(nodeRef.vx) * 0.6; }
        if (nodeRef.y < 12) { nodeRef.y = 12; nodeRef.vy = Math.abs(nodeRef.vy) * 0.6; }
        if (nodeRef.y > h - 12) { nodeRef.y = h - 12; nodeRef.vy = -Math.abs(nodeRef.vy) * 0.6; }
      }

      for (var li2 = 0; li2 < links.length; li2++) {
        var l2 = links[li2];
        var na = nodes[l2.a];
        var nb = nodes[l2.b];
        var cx = (na.x + nb.x) * 0.5;
        var cy = (na.y + nb.y) * 0.5;
        var pulse = Math.sin(t * 2.5 + li2) * 0.5 + 0.5;
        if ((na.act + nb.act) > 0.35) {
          ctx.beginPath();
          ctx.arc(cx, cy, 1.2 + pulse * 1.6, 0, TWO_PI);
          ctx.fillStyle = 'rgba(210,225,255,' + ((na.act + nb.act) * 0.12) + ')';
          ctx.fill();
        }
      }

      for (var i2 = 0; i2 < nodes.length; i2++) {
        var node = nodes[i2];
        var pulse = Math.sin(t * 1.8 + node.phase) * 0.5 + 0.5;
        var r = node.r + node.act * 3.2 + pulse * 0.55;
        if (node.act > 0.08) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, r + 5, 0, TWO_PI);
          ctx.fillStyle = 'rgba(' + node.color[0] + ',' + node.color[1] + ',' + node.color[2] + ',' + (node.act * 0.22) + ')';
          ctx.fill();
        }
        drawNode(node, r, 0.48 + node.act * 0.36 + pulse * 0.08);
      }
      if (!REDUCED_MOTION) requestAnimationFrame(frame);
    }
    frame();
  }

  function drawIargos(ctx, getSize, mouse, compact) {
    var canvas = ctx.canvas;
    var eyes = [], lastW = 0, lastH = 0;

    function build(w, h) {
      eyes = [];
      lastW = w; lastH = h;
      var count = compact ? Math.min(13, Math.max(7, Math.floor(w * h / 23000))) :
        Math.min(22, Math.max(12, Math.floor(w * h / 21000)));
      var minGap = compact ? 42 : 56;
      var attempts = 0;
      while (eyes.length < count && attempts < count * 80) {
        attempts += 1;
        var x = Math.random() * (w - 34) + 17;
        var y = Math.random() * (h - 30) + 15;
        var ok = true;
        for (var i = 0; i < eyes.length; i++) {
          var dx = eyes[i].x - x;
          var dy = eyes[i].y - y;
          if (Math.sqrt(dx * dx + dy * dy) < minGap) {
            ok = false;
            break;
          }
        }
        if (!ok) continue;
        eyes.push({
          x: x,
          y: y,
          angle: Math.random() * TWO_PI,
          pupilD: 0,
          scale: Math.random() * 0.35 + 0.85,
          blink: Math.random() * TWO_PI
        });
      }
    }

    function frame() {
      if (!canvas.isConnected) return;
      var wh = getSize(), w = wh[0], h = wh[1];
      if (!eyes.length || w !== lastW || h !== lastH) build(w, h);
      ctx.clearRect(0, 0, w, h);

      for (var i = 0; i < eyes.length; i++) {
        var e = eyes[i];
        var dx = mouse.x - e.x, dy = mouse.y - e.y;
        var d = Math.sqrt(dx * dx + dy * dy);
        var near = Math.max(0, 1 - d / (w * 0.52));
        var alpha = 0.38 + near * 0.38;

        if (mouse.inside && d > 1) {
          var target = Math.atan2(dy, dx);
          var diff = target - e.angle;
          while (diff > Math.PI) diff -= TWO_PI;
          while (diff < -Math.PI) diff += TWO_PI;
          e.angle += diff * 0.1;
          e.pupilD += (Math.min(2.8, d / 40) - e.pupilD) * 0.1;
        } else {
          e.pupilD *= 0.92;
        }

        var er = 10.5 * e.scale;
        var eh = er * (0.5 + Math.sin(Date.now() * 0.0008 + e.blink) * 0.035);
        ctx.beginPath();
        ctx.ellipse(e.x, e.y, er, eh, 0, 0, TWO_PI);
        ctx.strokeStyle = 'rgba(16,185,129,' + alpha + ')';
        ctx.lineWidth = 0.9;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(e.x, e.y, 4.2 * e.scale, 0, TWO_PI);
        ctx.strokeStyle = 'rgba(16,185,129,' + (alpha * 0.75) + ')';
        ctx.lineWidth = 0.5;
        ctx.stroke();

        var px = e.x + Math.cos(e.angle) * e.pupilD * er * 0.52;
        var py = e.y + Math.sin(e.angle) * e.pupilD * eh * 0.55;
        ctx.beginPath();
        ctx.arc(px, py, 3.1 * e.scale, 0, TWO_PI);
        ctx.fillStyle = 'rgba(52,211,153,' + (alpha * 1.55) + ')';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(px - 0.9, py - 0.9, 1, 0, TWO_PI);
        ctx.fillStyle = 'rgba(255,255,255,' + (alpha * 0.5) + ')';
        ctx.fill();
      }
      if (!REDUCED_MOTION) requestAnimationFrame(frame);
    }
    frame();
  }

  function drawLab(ctx, getSize, mouse, compact) {
    var canvas = ctx.canvas;
    var items = [], lanes = [], lastW = 0, lastH = 0, t = 0;
    var palette = {
      idea: [245, 158, 11],
      build: [56, 189, 248],
      test: [167, 139, 250],
      decide: [250, 204, 21],
      project: [74, 222, 128],
      archive: [148, 163, 184],
      line: [226, 232, 240]
    };
    var labels = compact ?
      ['IDEA', 'BUILD', 'TEST', 'OK?', 'SHIP'] :
      ['IDEA', 'PROTOTYPE', 'TEST', 'DECIDE', 'PROJECT'];

    function init(w, h) {
      items = [];
      lastW = w;
      lastH = h;
      var top = h * 0.22;
      var mid = h * 0.5;
      var bottom = h * 0.75;
      lanes = compact ? [
        { x: w * 0.15, y: mid, key: 'idea' },
        { x: w * 0.38, y: mid, key: 'build' },
        { x: w * 0.62, y: mid, key: 'test' },
        { x: w * 0.84, y: mid, key: 'project' }
      ] : [
        { x: w * 0.10, y: mid, key: 'idea' },
        { x: w * 0.30, y: mid, key: 'build' },
        { x: w * 0.50, y: mid, key: 'test' },
        { x: w * 0.68, y: mid, key: 'decide' },
        { x: w * 0.86, y: top, key: 'project' },
        { x: w * 0.86, y: bottom, key: 'archive' }
      ];
      var n = compact ? 8 : 14;
      for (var i = 0; i < n; i++) {
        var phase = Math.random();
        items.push({
          p: phase,
          speed: (compact ? 0.00028 : 0.00022) + Math.random() * 0.00012,
          offset: (Math.random() - 0.5) * (compact ? 22 : 34),
          size: Math.random() * 3.5 + (compact ? 7 : 8.5),
          type: i % 4,
          jitter: Math.random() * TWO_PI
        });
      }
    }

    function pointOnFlow(p, w, h, offset) {
      if (compact) {
        var seg = Math.min(2.999, p * 3);
        var idx = Math.floor(seg);
        var local = seg - idx;
        var a = lanes[idx], b = lanes[idx + 1];
        return {
          x: a.x + (b.x - a.x) * local,
          y: a.y + (b.y - a.y) * local + Math.sin(local * Math.PI) * offset
        };
      }

      if (p < 0.72) {
        var segA = Math.min(2.999, p / 0.72 * 3);
        var i = Math.floor(segA);
        var l = segA - i;
        var from = lanes[i], to = lanes[i + 1];
        return {
          x: from.x + (to.x - from.x) * l,
          y: from.y + (to.y - from.y) * l + Math.sin(l * Math.PI) * offset
        };
      }

      var route = p < 0.86 ? lanes[4] : lanes[5];
      var d = (p - 0.72) / 0.28;
      d = Math.min(1, Math.max(0, d));
      return {
        x: lanes[3].x + (route.x - lanes[3].x) * d,
        y: lanes[3].y + (route.y - lanes[3].y) * d + offset * 0.35
      };
    }

    function drawLabelBox(x, y, text, color, alpha, active) {
      var boxW = Math.max(54, text.length * 7 + 18);
      var boxH = compact ? 20 : 24;
      if (active > 0.04) {
        ctx.beginPath();
        ctx.roundRect(x - boxW / 2 - 5, y - boxH / 2 - 5, boxW + 10, boxH + 10, 8);
        ctx.fillStyle = 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ',' + (active * 0.13) + ')';
        ctx.fill();
      }
      ctx.beginPath();
      ctx.roundRect(x - boxW / 2, y - boxH / 2, boxW, boxH, 6);
      ctx.fillStyle = 'rgba(10,16,24,' + (0.44 + active * 0.08) + ')';
      ctx.fill();
      ctx.strokeStyle = 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ',' + (alpha + active * 0.32) + ')';
      ctx.lineWidth = 0.9 + active * 0.45;
      ctx.stroke();
      ctx.font = (compact ? '8px' : '9px') + ' JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'rgba(241,245,249,' + (0.72 + active * 0.22) + ')';
      ctx.fillText(text, x, y + 0.5);
    }

    function drawArrow(a, b, alpha, active, color) {
      var dx = b.x - a.x;
      var dy = b.y - a.y;
      var angle = Math.atan2(dy, dx);
      var startX = a.x + Math.cos(angle) * 38;
      var startY = a.y + Math.sin(angle) * 18;
      var endX = b.x - Math.cos(angle) * 38;
      var endY = b.y - Math.sin(angle) * 18;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ',' + (alpha + active * 0.32) + ')';
      ctx.lineWidth = 0.8 + active * 0.7;
      ctx.setLineDash([5, 7]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(endX, endY);
      ctx.lineTo(endX - Math.cos(angle - 0.55) * 8, endY - Math.sin(angle - 0.55) * 8);
      ctx.lineTo(endX - Math.cos(angle + 0.55) * 8, endY - Math.sin(angle + 0.55) * 8);
      ctx.closePath();
      ctx.fillStyle = 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ',' + (alpha + active * 0.25 + 0.06) + ')';
      ctx.fill();
    }

    function drawItem(item, x, y, active) {
      var alpha = 0.28 + active * 0.5;
      var c = palette.build;
      if (item.p < 0.2) c = palette.idea;
      else if (item.p < 0.48) c = palette.build;
      else if (item.p < 0.72) c = palette.test;
      else if (item.p < 0.86) c = palette.project;
      else c = palette.archive;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Math.sin(t * 0.55 + item.jitter) * 0.035);
      if (active > 0.04) {
        ctx.beginPath();
        ctx.arc(0, 0, item.size + active * 11, 0, TWO_PI);
        ctx.fillStyle = 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + (active * 0.13) + ')';
        ctx.fill();
      }
      ctx.beginPath();
      if (item.type === 0) {
        ctx.roundRect(-item.size * 1.45, -item.size * 0.75, item.size * 2.9, item.size * 1.5, 4);
      } else if (item.type === 1) {
        ctx.arc(0, 0, item.size * 0.9, 0, TWO_PI);
      } else if (item.type === 2) {
        ctx.roundRect(-item.size * 0.85, -item.size * 0.85, item.size * 1.7, item.size * 1.7, 3);
      } else {
        ctx.moveTo(0, -item.size * 1.1);
        ctx.lineTo(item.size * 1.1, item.size * 0.75);
        ctx.lineTo(-item.size * 1.1, item.size * 0.75);
        ctx.closePath();
      }
      ctx.fillStyle = 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + alpha + ')';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,' + (0.2 + active * 0.28) + ')';
      ctx.lineWidth = 0.75;
      ctx.stroke();
      ctx.restore();
    }

    function frame() {
      if (!canvas.isConnected) return;
      t += 0.018;
      var wh = getSize(), w = wh[0], h = wh[1];
      if ((!items.length && w && h) || w !== lastW || h !== lastH) init(w, h);
      ctx.clearRect(0, 0, w, h);

      var laneActive = lanes.map(function (lane) {
        if (!mouse.inside) return 0;
        var dx = lane.x - mouse.x;
        var dy = lane.y - mouse.y;
        return Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / 130);
      });

      for (var a = 0; a < lanes.length - 1; a++) {
        if (!compact && a === 4) continue;
        if (!compact && a === 3) {
          drawArrow(lanes[3], lanes[4], 0.16, Math.max(laneActive[3], laneActive[4]), palette.project);
          drawArrow(lanes[3], lanes[5], 0.12, Math.max(laneActive[3], laneActive[5]), palette.archive);
          break;
        }
        drawArrow(lanes[a], lanes[a + 1], 0.13, Math.max(laneActive[a], laneActive[a + 1]), palette.line);
      }

      for (var l = 0; l < lanes.length; l++) {
        var lane = lanes[l];
        var text = labels[l] || (lane.key === 'archive' ? 'ARCHIVE' : lane.key.toUpperCase());
        drawLabelBox(lane.x, lane.y, text, palette[lane.key] || palette.idea, 0.34, laneActive[l]);
      }

      for (var i = 0; i < items.length; i++) {
        var it = items[i];
        var pos = pointOnFlow(it.p, w, h, it.offset + Math.sin(t + it.jitter) * 4);
        var mdx = pos.x - mouse.x;
        var mdy = pos.y - mouse.y;
        var md = Math.sqrt(mdx * mdx + mdy * mdy);
        var active = Math.max(0, 1 - md / 110);
        it.p += it.speed;
        if (it.p > 1) it.p -= 1;

        drawItem(it, pos.x, pos.y, active);
      }

      if (!REDUCED_MOTION) requestAnimationFrame(frame);
    }
    frame();
  }

  function drawKairos(ctx, getSize, mouse, compact) {
    var canvas = ctx.canvas;
    var nodes = [];
    var links = [];
    var lastW = 0;
    var lastH = 0;
    var t = 0;
    var palette = [
      [122, 174, 138],
      [90, 138, 106],
      [232, 228, 220],
      [58, 106, 78]
    ];

    function init(w, h) {
      nodes = [];
      links = [];
      lastW = w;
      lastH = h;
      var count = compact ? 14 : 24;
      for (var i = 0; i < count; i++) {
        var col = palette[i % palette.length];
        nodes.push({
          x: w * (0.12 + Math.random() * 0.76),
          y: h * (0.16 + Math.random() * 0.68),
          ox: 0,
          oy: 0,
          r: compact ? 2.2 + Math.random() * 2.8 : 2.8 + Math.random() * 4.2,
          color: col,
          phase: Math.random() * TWO_PI,
          type: i % 3
        });
      }

      for (var a = 0; a < nodes.length; a++) {
        var distances = [];
        for (var b = 0; b < nodes.length; b++) {
          if (a === b) continue;
          var dx = nodes[a].x - nodes[b].x;
          var dy = nodes[a].y - nodes[b].y;
          distances.push({ i: b, d: Math.sqrt(dx * dx + dy * dy) });
        }
        distances.sort(function (p, q) { return p.d - q.d; });
        var max = compact ? 2 : 3;
        for (var k = 0; k < max; k++) {
          var bi = distances[k] && distances[k].i;
          if (bi == null) continue;
          var exists = links.some(function (ln) {
            return (ln.a === a && ln.b === bi) || (ln.a === bi && ln.b === a);
          });
          if (!exists && distances[k].d < (compact ? 125 : 210)) {
            links.push({ a: a, b: bi, rest: distances[k].d, pulse: Math.random() * TWO_PI });
          }
        }
      }
    }

    function nodePos(n) {
      return {
        x: n.x + n.ox + Math.sin(t * 0.55 + n.phase) * 3,
        y: n.y + n.oy + Math.cos(t * 0.45 + n.phase) * 3
      };
    }

    function drawNode(n, p, active) {
      var c = n.color;
      if (active > 0.04) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, n.r + active * 16, 0, TWO_PI);
        ctx.fillStyle = 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + (active * 0.13) + ')';
        ctx.fill();
      }

      ctx.beginPath();
      if (n.type === 0) {
        ctx.arc(p.x, p.y, n.r, 0, TWO_PI);
      } else if (n.type === 1) {
        ctx.roundRect(p.x - n.r, p.y - n.r, n.r * 2, n.r * 2, 2);
      } else {
        ctx.moveTo(p.x, p.y - n.r * 1.25);
        ctx.lineTo(p.x + n.r * 1.1, p.y + n.r * 0.7);
        ctx.lineTo(p.x - n.r * 1.1, p.y + n.r * 0.7);
        ctx.closePath();
      }
      ctx.fillStyle = 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + (0.48 + active * 0.28) + ')';
      ctx.fill();
      ctx.strokeStyle = 'rgba(232,228,220,' + (0.18 + active * 0.35) + ')';
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }

    function frame() {
      if (!canvas.isConnected) return;
      t += 0.018;
      var wh = getSize(), w = wh[0], h = wh[1];
      if ((!nodes.length && w && h) || Math.abs(w - lastW) > 2 || Math.abs(h - lastH) > 2) init(w, h);
      ctx.clearRect(0, 0, w, h);

      var positions = nodes.map(nodePos);
      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        var p = positions[i];
        var mdx = p.x - mouse.x;
        var mdy = p.y - mouse.y;
        var md = Math.sqrt(mdx * mdx + mdy * mdy);
        var active = mouse.inside ? Math.max(0, 1 - md / (compact ? 92 : 150)) : 0;
        if (active > 0.02 && md > 1) {
          n.ox += (mdx / md) * active * 0.45;
          n.oy += (mdy / md) * active * 0.45;
        }
        n.ox *= 0.92;
        n.oy *= 0.92;
      }

      for (var l = 0; l < links.length; l++) {
        var link = links[l];
        var a = positions[link.a];
        var b = positions[link.b];
        var na = nodes[link.a];
        var nb = nodes[link.b];
        var ax = a.x - mouse.x;
        var ay = a.y - mouse.y;
        var bx = b.x - mouse.x;
        var by = b.y - mouse.y;
        var activeLink = mouse.inside ? Math.max(
          0,
          1 - Math.min(Math.sqrt(ax * ax + ay * ay), Math.sqrt(bx * bx + by * by)) / (compact ? 105 : 170)
        ) : 0;
        var pulse = 0.07 + Math.sin(t * 1.15 + link.pulse) * 0.035;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = 'rgba(122,174,138,' + (pulse + activeLink * 0.22) + ')';
        ctx.lineWidth = 0.7 + activeLink * 0.8;
        ctx.stroke();

        if (!compact && activeLink > 0.08) {
          var midX = (a.x + b.x) / 2;
          var midY = (a.y + b.y) / 2;
          ctx.beginPath();
          ctx.arc(midX, midY, 1.2 + activeLink * 2.5, 0, TWO_PI);
          ctx.fillStyle = 'rgba(232,228,220,' + (0.12 + activeLink * 0.22) + ')';
          ctx.fill();
        }
        na.ox += (nb.ox - na.ox) * 0.018;
        na.oy += (nb.oy - na.oy) * 0.018;
      }

      for (var j = 0; j < nodes.length; j++) {
        var pp = positions[j];
        var dx = pp.x - mouse.x;
        var dy = pp.y - mouse.y;
        var activeNode = mouse.inside ? Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / (compact ? 92 : 150)) : 0;
        drawNode(nodes[j], pp, activeNode);
      }

      if (!compact) {
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.textAlign = 'right';
        ctx.fillStyle = 'rgba(122,174,138,.22)';
        ctx.fillText('KAIROS // causal resonance', w - 28, h - 26);
      }

      if (!REDUCED_MOTION) requestAnimationFrame(frame);
    }
    frame();
  }

  function boot() {
    attachHero();
    bootCardsWhenRendered();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  document.addEventListener('langChange', function () { setTimeout(attachCards, 80); });
})();
