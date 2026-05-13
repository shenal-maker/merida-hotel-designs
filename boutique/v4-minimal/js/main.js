/* Boutique by The Museo — v4 minimal
   Tiny vanilla JS: sticky header, reveal-on-scroll, booking validation,
   date defaults, lucide icon hydration. */

(function () {
  "use strict";

  // ---------- Lucide icons (CDN, deferred) ----------
  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons();
  }

  // ---------- Sticky header ----------
  const header = document.querySelector(".site-header");
  if (header) {
    const onScroll = () => {
      const stuck = window.scrollY > 80;
      header.classList.toggle("is-stuck", stuck);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // ---------- Date defaults: arrival tomorrow, departure +3 ----------
  const fmt = (d) => d.toISOString().slice(0, 10);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
  const plusFour = new Date(today); plusFour.setDate(plusFour.getDate() + 4);

  document.querySelectorAll('input[type="date"][data-role="arrival"]').forEach((el) => {
    el.min = fmt(today);
    if (!el.value) el.value = fmt(tomorrow);
  });
  document.querySelectorAll('input[type="date"][data-role="departure"]').forEach((el) => {
    el.min = fmt(tomorrow);
    if (!el.value) el.value = fmt(plusFour);
  });

  // Keep arrival/departure consistent
  document.querySelectorAll(".booking").forEach((form) => {
    const arrival = form.querySelector('[data-role="arrival"]');
    const departure = form.querySelector('[data-role="departure"]');
    if (!arrival || !departure) return;
    arrival.addEventListener("change", () => {
      const a = new Date(arrival.value);
      if (isNaN(a)) return;
      const minDep = new Date(a); minDep.setDate(minDep.getDate() + 1);
      departure.min = fmt(minDep);
      if (new Date(departure.value) <= a) departure.value = fmt(minDep);
    });

    form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const a = arrival.value;
      const d = departure.value;
      const g = form.querySelector('[data-role="guests"]').value || "2";
      // In production this would forward to the booking engine.
      // For the portfolio build, surface a non-blocking confirmation.
      const btn = form.querySelector(".btn-primary");
      if (btn) {
        const original = btn.dataset.label || btn.textContent.trim();
        btn.dataset.label = original;
        btn.textContent = `Checking ${a} → ${d} · ${g}`;
        setTimeout(() => { btn.textContent = original; }, 1800);
      }
    });
  });

  // ---------- Reveal on scroll ----------
  const motionOk = window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
  const reveals = document.querySelectorAll(".reveal");
  if (motionOk && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.05 });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-in"));
  }

  // ---------- Smooth anchor offsets ----------
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });
})();
