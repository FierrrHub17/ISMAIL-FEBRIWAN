(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hero = document.getElementById("beranda");

  /* ---- Teks mengetik ---- */
  var typed = document.getElementById("typed");
  var words = ["Teknik Komputer", "IoT & Mikrokontroler", "Pengembangan Web", "Administrasi Digital"];
  if (typed && !reduce) {
    var wi = 0, ci = 0, del = false;
    (function tick() {
      var w = words[wi];
      typed.textContent = w.slice(0, ci);
      var delay = del ? 45 : 90;
      if (!del && ci === w.length) { del = true; delay = 1400; }
      else if (del && ci === 0) { del = false; wi = (wi + 1) % words.length; delay = 350; }
      else { ci += del ? -1 : 1; }
      setTimeout(tick, delay);
    })();
  }

  /* ---- Bintang ---- */
  var canvas = document.getElementById("stars");
  var ctx = canvas.getContext("2d");
  var stars = [], W = 0, H = 0, visible = true, lastT = 0;

  function build() {
    var n = Math.round((W * H) / 9000);
    stars = [];
    for (var i = 0; i < n; i++) {
      stars.push({
        x: Math.random() * W, y: Math.random() * H,
        r: Math.random() * 1.2 + 0.3,
        p: Math.random() * 6.28, s: Math.random() * 0.8 + 0.3,
        v: Math.random() * 4 + 1
      });
    }
  }
  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = hero.clientWidth; H = hero.clientHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    build();
    if (reduce) draw(0, 0);
  }
  function draw(t, dt) {
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < stars.length; i++) {
      var st = stars[i];
      var a = reduce ? 0.6 : 0.3 + 0.7 * (0.5 + 0.5 * Math.sin((t / 1000) * st.s * 2 + st.p));
      ctx.globalAlpha = a;
      ctx.fillStyle = st.r > 1.1 ? "#9bbcff" : "#ffffff";
      ctx.beginPath(); ctx.arc(st.x, st.y, st.r, 0, 6.283); ctx.fill();
      if (!reduce) {
        st.y -= st.v * 0.8 * dt / 1000;
        if (st.y < -2) { st.y = H + 2; st.x = Math.random() * W; }
      }
    }
    ctx.globalAlpha = 1;
  }
  function starLoop(t) {
    var dt = Math.min(t - lastT, 50); lastT = t;
    if (visible && !document.hidden) draw(t, dt);
    requestAnimationFrame(starLoop);
  }
  window.addEventListener("resize", resize);
  resize();
  if (!reduce) {
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (e) { visible = e[0].isIntersecting; }).observe(hero);
    }
    requestAnimationFrame(starLoop);
  }

  /* ---- Kartu ID: ayunan bandul, bisa ditarik ---- */
  var anchor = document.getElementById("lanyard");
  var swing = document.getElementById("swing");
  var card = document.getElementById("idCard");
  if (!anchor || !swing || !card) return;

  var angle = reduce ? 0 : 0.4;   // sudut CSS (rad)
  var vel = 0, tilt = 0;
  var dragging = false, lastMove = 0, lastFrame = performance.now();
  var K = 24, C = 1.5;

  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  function frame(now) {
    var dt = Math.min((now - lastFrame) / 1000, 0.033);
    lastFrame = now;
    if (!dragging) {
      var acc = -K * Math.sin(angle) - C * vel;
      if (!reduce) acc += 0.5 * Math.sin(now / 1100);   // hembusan kecil
      vel += acc * dt;
      angle += vel * dt;
    }
    tilt += (clamp(vel * 9, -24, 24) - tilt) * 0.15;
    swing.style.transform = "rotate(" + angle + "rad)";
    card.style.transform = "perspective(900px) rotateY(" + tilt + "deg)";
    requestAnimationFrame(frame);
  }

  card.addEventListener("pointerdown", function (e) {
    dragging = true; vel = 0; lastMove = performance.now();
    card.classList.add("is-grabbed");
    card.setPointerCapture(e.pointerId);
  });
  card.addEventListener("pointermove", function (e) {
    if (!dragging) return;
    var r = anchor.getBoundingClientRect();
    var dx = e.clientX - r.left, dy = Math.max(e.clientY - r.top, 60);
    var target = clamp(-Math.atan2(dx, dy), -1, 1);
    var now = performance.now();
    var dt = Math.max((now - lastMove) / 1000, 0.008);
    vel = clamp((target - angle) / dt, -12, 12);
    angle = target; lastMove = now;
  });
  function release() {
    if (!dragging) return;
    dragging = false;
    card.classList.remove("is-grabbed");
    if (performance.now() - lastMove > 90) vel = 0;
  }
  card.addEventListener("pointerup", release);
  card.addEventListener("pointercancel", release);
  card.addEventListener("dragstart", function (e) { e.preventDefault(); });

  requestAnimationFrame(frame);
})();
