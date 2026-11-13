/* Portfolio site script. You do not need to edit this file:
   all text, photos and links live in content.json. */
(function () {
  "use strict";
  const $ = (s, el = document) => el.querySelector(s);
  const el = (tag, cls, html) => { const n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; };
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  fetch("content.json", { cache: "no-cache" })
    .then((r) => r.json())
    .then(render)
    .catch((e) => console.error("Could not load content.json:", e));

  function render(C) {
    const S = C.site;
    const siteUrl = (location.protocol.startsWith("http") ? location.origin + location.pathname.replace(/index\.html$/, "") : S.url);

    /* ---------- Hero ---------- */
    $("#heroGreeting").textContent = C.hero.greeting;
    $("#rotIntro").textContent = C.hero.rotatingIntro;
    $("#heroTagline").textContent = C.hero.tagline;
    $("#heroPhoto").src = C.hero.photo;
    $("#heroBadge").textContent = C.hero.badge;
    rotate(C.hero.rotating);
    document.querySelectorAll("[data-cv]").forEach((a) => (a.href = S.cvFile));

    /* ---------- About ---------- */
    $("#aboutPhoto").src = C.about.photo;
    $("#aboutText").innerHTML = C.about.paragraphs.map((p) => `<p>${esc(p)}</p>`).join("");
    $("#aboutFacts").innerHTML = C.about.facts.map((f) => `<div><dt>${esc(f.label)}</dt><dd>${esc(f.value)}</dd></div>`).join("");

    /* ---------- Highlights ---------- */
    $("#stats").innerHTML = C.highlights.map((h) => `
      <div class="stat reveal">
        <div class="stat-num"><span>${esc(h.prefix)}</span><span class="count" data-to="${Number(h.number)}">0</span><span>${esc(h.suffix)}</span></div>
        <p class="stat-label">${esc(h.label)}</p>
      </div>`).join("");

    /* ---------- Experience ---------- */
    const tl = $("#timeline");
    C.experience.forEach((x, i) => {
      const li = el("li", "tl-item reveal");
      li.dataset.type = x.type || "work";
      if (i === 0) li.classList.add("open");
      li.innerHTML = `
        <span class="tl-dot" aria-hidden="true"></span>
        <button class="tl-card" aria-expanded="${i === 0}">
          <div class="tl-head"><p class="tl-role">${esc(x.role)}</p><span class="tl-dates">${esc(x.dates)}</span></div>
          <p class="tl-org">${esc(x.org)}</p>
          <div class="tl-more"><div><ul>${(x.points || []).map((p) => `<li>${esc(p)}</li>`).join("")}</ul></div></div>
          <span class="tl-toggle">${i === 0 ? "Details" : "Details"}</span>
        </button>`;
      li.querySelector(".tl-card").addEventListener("click", (e) => {
        const open = li.classList.toggle("open");
        e.currentTarget.setAttribute("aria-expanded", open);
      });
      tl.appendChild(li);
    });

    /* ---------- Works ---------- */
    const tags = ["All", ...new Set(C.projects.flatMap((p) => p.tags))];
    const filters = $("#filters");
    tags.forEach((t, i) => {
      const b = el("button", "chip", esc(t));
      b.setAttribute("role", "tab");
      b.setAttribute("aria-selected", i === 0);
      b.addEventListener("click", () => {
        filters.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-selected", c === b));
        document.querySelectorAll(".card").forEach((c) => c.classList.toggle("hide", t !== "All" && !c.dataset.tags.split("|").includes(t)));
      });
      filters.appendChild(b);
    });
    const cards = $("#cards");
    C.projects.forEach((p) => {
      const c = el("button", "card reveal");
      c.dataset.tags = p.tags.join("|");
      c.innerHTML = `
        <div class="card-img"><img src="${esc(p.cover.replace(/\.webp$/, "-sm.webp"))}" alt="" loading="lazy" onerror="this.onerror=null;this.src='${esc(p.cover)}'"></div>
        <div class="card-body">
          <div class="card-tags">${p.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
          <h3>${esc(p.title)}</h3>
          <p>${esc(p.summary)}</p>
          <span class="card-more">View details →</span>
        </div>`;
      c.addEventListener("click", () => openProject(p));
      cards.appendChild(c);
    });

    /* ---------- Awards ---------- */
    const icon = { International: "🌏", National: "🏅", University: "🎓" };
    $("#awardList").innerHTML = C.awards.map((a) => `
      <div class="award reveal">
        <span class="award-icon" aria-hidden="true">${icon[a.level] || "⭐"}</span>
        <div><h3>${esc(a.title)}</h3><p>${esc(a.detail)}</p><span class="level">${esc(a.level)}</span></div>
      </div>`).join("");

    /* ---------- Gallery ---------- */
    const g = $("#galleryGrid");
    C.gallery.forEach((ph, i) => {
      const b = el("button", "reveal");
      b.setAttribute("aria-label", "Open photo: " + ph.caption);
      b.innerHTML = `<img src="${esc(ph.src.replace(/\.webp$/, "-sm.webp"))}" alt="${esc(ph.caption)}" loading="lazy" onerror="this.onerror=null;this.src='${esc(ph.src)}'">`;
      b.addEventListener("click", () => openLightbox(C.gallery, i));
      g.appendChild(b);
    });

    /* ---------- Skills & Currently ---------- */
    $("#skillGroups").innerHTML = C.skills.map((s) => `
      <div class="skill-group"><h3>${esc(s.group)}</h3><div class="pills">${s.items.map((x) => `<span class="pill">${esc(x)}</span>`).join("")}</div></div>`).join("");
    $("#currentlyList").innerHTML = C.currently.filter((c) => c.text).map((c) => `
      <li><span aria-hidden="true">${esc(c.icon)}</span><div><span class="c-label">${esc(c.label)}</span><p class="c-text">${esc(c.text)}</p></div></li>`).join("");

    /* ---------- Testimonials ---------- */
    if (C.testimonials && C.testimonials.length) {
      $("#testimonials").hidden = false;
      $("#quoteList").innerHTML = C.testimonials.map((t) => `
        <figure class="quote reveal"><blockquote>“${esc(t.quote)}”</blockquote><figcaption><strong>${esc(t.name)}</strong><br>${esc(t.role)}</figcaption></figure>`).join("");
    }

    /* ---------- Documents ---------- */
    $("#docList").innerHTML = C.documents.map((d) => `
      <div class="doc reveal">
        <a class="doc-thumb" href="${esc(d.file)}" target="_blank" rel="noopener" aria-label="Open ${esc(d.title)}"><img src="${esc(d.thumb)}" alt="Preview of ${esc(d.title)}" loading="lazy"></a>
        <div class="doc-body">
          <h3>${esc(d.title)}</h3><p>${esc(d.description)}</p>
          <div class="doc-actions"><a href="${esc(d.file)}" target="_blank" rel="noopener">View</a><a href="${esc(d.file)}" download>Download</a></div>
        </div>
      </div>`).join("");

    /* ---------- Contact ---------- */
    $("#contactHeading").textContent = C.contact.heading;
    $("#contactText").textContent = C.contact.text;
    $("#emailLink").href = "mailto:" + S.email;
    $("#emailText").textContent = S.email;
    $("#linkedinLink").href = S.linkedin;
    setupForm(S);
    setupQR(siteUrl);

    /* ---------- Analytics (GoatCounter, privacy-friendly, optional) ---------- */
    if (S.goatcounterCode && location.protocol.startsWith("http")) {
      const s = document.createElement("script");
      s.async = true; s.src = "https://gc.zgo.at/count.js";
      s.dataset.goatcounter = `https://${S.goatcounterCode}.goatcounter.com/count`;
      document.body.appendChild(s);
    }

    $("#year").textContent = new Date().getFullYear();
    setupReveal();
    setupEasterEgg();
  }

  /* ---------- Rotating headline (typing effect) ---------- */
  function rotate(words) {
    const out = $("#rotWord");
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { out.textContent = words[0]; return; }
    let w = 0, i = 0, del = false;
    (function tick() {
      const word = words[w];
      out.textContent = word.slice(0, i);
      if (!del && i < word.length) { i++; setTimeout(tick, 70); }
      else if (!del) { del = true; setTimeout(tick, 1800); }
      else if (i > 0) { i--; setTimeout(tick, 35); }
      else { del = false; w = (w + 1) % words.length; setTimeout(tick, 300); }
    })();
  }

  /* ---------- Scroll reveal + counters ---------- */
  function setupReveal() {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("in");
        e.target.querySelectorAll(".count").forEach(countUp);
        io.unobserve(e.target);
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach((n) => io.observe(n));
    const nav = $(".nav");
    addEventListener("scroll", () => nav.classList.toggle("scrolled", scrollY > 10), { passive: true });
  }
  function countUp(n) {
    const to = +n.dataset.to, dur = 1400, t0 = performance.now();
    const fmt = (v) => v.toLocaleString("en-US");
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { n.textContent = fmt(to); return; }
    (function step(t) {
      const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      n.textContent = fmt(Math.round(to * e));
      if (k < 1) requestAnimationFrame(step);
    })(t0);
  }

  /* ---------- Project dialog ---------- */
  function openProject(p) {
    const d = $("#projectDialog");
    $("#pdBody").innerHTML = `
      ${p.photos && p.photos.length ? `<div class="pd-photos">${p.photos.map((src, i) => `<img src="${esc(src)}" alt="${esc(p.title)} photo ${i + 1}" data-i="${i}">`).join("")}</div>` : ""}
      <div class="pd-content">
        <div class="card-tags">${p.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
        <h3 id="pdTitle">${esc(p.title)}</h3>
        <p class="pd-meta">${esc(p.dates)} · ${esc(p.location)}</p>
        <span class="pd-role"><strong>My role:</strong> ${esc(p.role)}</span>
        <p>${esc(p.description)}</p>
        ${p.results && p.results.length ? `<h4>Highlights</h4><ul>${p.results.map((r) => `<li>${esc(r)}</li>`).join("")}</ul>` : ""}
        ${p.links && p.links.length ? `<div class="pd-links">${p.links.map((l) => `<a class="btn btn-ghost" href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)} ↗</a>`).join("")}</div>` : ""}
      </div>`;
    d.querySelectorAll(".pd-photos img").forEach((img) => img.addEventListener("click", () => openLightbox(p.photos.map((src) => ({ src, caption: p.title })), +img.dataset.i)));
    d.showModal();
    d.scrollTop = 0;
  }
  const dlg = $("#projectDialog");
  dlg.addEventListener("click", (e) => { if (e.target === dlg || e.target.hasAttribute("data-close")) dlg.close(); });

  /* ---------- Lightbox (keyboard + swipe) ---------- */
  let lbList = [], lbI = 0;
  const lb = $("#lightbox");
  function openLightbox(list, i) { lbList = list; lbI = i; showLb(); lb.hidden = false; document.body.style.overflow = "hidden"; }
  function showLb() { const it = lbList[lbI]; $("#lbImg").src = it.src; $("#lbImg").alt = it.caption || ""; $("#lbCap").textContent = it.caption || ""; }
  function closeLb() { lb.hidden = true; document.body.style.overflow = ""; }
  function step(n) { lbI = (lbI + n + lbList.length) % lbList.length; showLb(); }
  lb.addEventListener("click", (e) => {
    const a = e.target.dataset.lb;
    if (a === "close" || e.target === lb) closeLb(); else if (a === "prev") step(-1); else if (a === "next") step(1);
  });
  addEventListener("keydown", (e) => {
    if (lb.hidden) return;
    if (e.key === "Escape") closeLb(); else if (e.key === "ArrowLeft") step(-1); else if (e.key === "ArrowRight") step(1);
  });
  let sx = null;
  lb.addEventListener("touchstart", (e) => (sx = e.touches[0].clientX), { passive: true });
  lb.addEventListener("touchend", (e) => { if (sx == null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 45) step(dx < 0 ? 1 : -1); sx = null; });

  /* ---------- Theme toggle ---------- */
  $("#themeToggle").addEventListener("click", () => {
    const t = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = t;
    localStorage.setItem("theme", t);
  });

  /* ---------- Contact form (Web3Forms, free) ---------- */
  function setupForm(S) {
    const f = $("#contactForm"), status = $("#formStatus");
    f.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!f.checkValidity()) { status.textContent = "Please fill in all fields with a valid email."; return; }
      const data = Object.fromEntries(new FormData(f));
      if (!S.web3formsKey) {
        // No key yet: open the visitor's email app instead
        location.href = `mailto:${S.email}?subject=${encodeURIComponent("Hello from " + data.name)}&body=${encodeURIComponent(data.message + "\n\n" + data.name + " (" + data.email + ")")}`;
        return;
      }
      status.textContent = "Sending…";
      try {
        const r = await fetch("https://api.web3forms.com/submit", {
          method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ access_key: S.web3formsKey, subject: "New message from your website", from_name: data.name, ...data }),
        });
        const j = await r.json();
        if (j.success) { f.reset(); status.textContent = "Thank you! Your message has been sent. 🎉"; }
        else throw new Error(j.message);
      } catch (err) { status.textContent = "Sorry, something went wrong. Please email me directly."; }
    });
  }

  /* ---------- QR code ---------- */
  function setupQR(url) {
    if (typeof qrcode === "undefined") return;
    const q = qrcode(0, "M"); q.addData(url); q.make();
    $("#qr").innerHTML = q.createSvgTag({ cellSize: 4, margin: 0, scalable: true });
    $("#qrDownload").addEventListener("click", () => {
      const c = document.createElement("canvas"), n = q.getModuleCount(), s = 16, m = 4;
      c.width = c.height = (n + m * 2) * s;
      const x = c.getContext("2d"); x.fillStyle = "#fff"; x.fillRect(0, 0, c.width, c.height); x.fillStyle = "#0B2545";
      for (let r = 0; r < n; r++) for (let k = 0; k < n; k++) if (q.isDark(r, k)) x.fillRect((k + m) * s, (r + m) * s, s, s);
      const a = document.createElement("a"); a.download = "website-qr-code.png"; a.href = c.toDataURL("image/png"); a.click();
    });
  }

  /* ---------- Easter egg: click the portrait 5 times ---------- */
  function setupEasterEgg() {
    let n = 0, t;
    $("#heroPhoto").addEventListener("click", () => {
      n++; clearTimeout(t); t = setTimeout(() => (n = 0), 1500);
      if (n < 5) return;
      n = 0; toast("📋 Planner mode unlocked! Every great programme starts with a checklist ✓");
      const colors = ["#C9A227", "#0B2545", "#E9D9A6", "#2EAD6B", "#13315C"];
      for (let i = 0; i < 80; i++) {
        const c = el("span", "confetti");
        c.style.left = Math.random() * 100 + "vw"; c.style.background = colors[i % colors.length];
        c.style.animationDuration = 2 + Math.random() * 2 + "s"; c.style.animationDelay = Math.random() * .5 + "s";
        document.body.appendChild(c); setTimeout(() => c.remove(), 4800);
      }
    });
    console.log("%cHi there, curious recruiter! 👋", "font-size:16px;font-weight:bold;color:#C9A227");
    console.log("Thanks for looking under the hood. Let's connect: https://www.linkedin.com/in/asyqinazaley");
  }
  function toast(msg) { const tt = $("#toast"); tt.textContent = msg; tt.hidden = false; setTimeout(() => (tt.hidden = true), 4200); }
})();
