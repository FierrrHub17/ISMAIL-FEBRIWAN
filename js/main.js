(function () {
  "use strict";

  var toggle = document.getElementById("navToggle");
  var menu = document.getElementById("navMenu");
  var links = menu.querySelectorAll("a");

  /* ---- Menu mobile ---- */
  function setMenu(open) {
    menu.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
  }
  toggle.addEventListener("click", function () {
    setMenu(toggle.getAttribute("aria-expanded") !== "true");
  });
  links.forEach(function (a) {
    a.addEventListener("click", function () { setMenu(false); });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setMenu(false);
  });

  /* ---- Tautan aktif sesuai bagian yang terlihat ---- */
  var sections = Array.prototype.map.call(links, function (a) {
    return document.querySelector(a.getAttribute("href"));
  });
  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) {
          a.classList.toggle("is-active", a.getAttribute("href") === "#" + entry.target.id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { if (s) spy.observe(s); });
  }

  /* ---- Formulir kontak: kirim lewat WhatsApp ---- */
  var form = document.getElementById("contactForm");
  var err = document.getElementById("formError");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var nama = form.elements.nama.value.trim();
    var pesan = form.elements.pesan.value.trim();
    if (!nama || !pesan) { err.hidden = false; return; }
    err.hidden = true;
    var text = "Halo Ismail, saya " + nama + ".\n\n" + pesan;
    window.open("https://wa.me/6285953245446?text=" + encodeURIComponent(text), "_blank", "noopener");
    form.reset();
  });

  /* ---- Tahun footer ---- */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
