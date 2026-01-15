/* Miradent one-page: sticky nav, progress dots, infinite carousels (auto + swipe), lightbox, subtle reveal */

const SECTIONS = [
  { id: "acasa", label: "Acasă" },
  { id: "servicii", label: "Servicii" },
  { id: "echipa", label: "Echipa" },
  { id: "tarife", label: "Tarife" },
  { id: "galerie", label: "Galerie" },
  { id: "testimoniale", label: "Testimoniale" },
  { id: "contact", label: "Contact" },
];

const ASSETS = {
  gallery: [
    "./a-closeup-shot-of-a-smiling-woman-showing-her-clea-2026-01-11-08-37-43-utc.jpg",
    "./close-up-of-young-woman-s-mouth-2026-01-11-09-42-06-utc.jpg",
    "./exuding-radiance-captivating-close-up-of-a-woman-2026-01-06-11-00-32-utc.jpg",
    "./woman-s-lips-and-teeth-smile-close-up-2026-01-06-10-56-09-utc.jpg",
    "./in-a-modern-medical-center-dentistry-checks-the-r-2026-01-05-05-35-48-utc.jpg",
    "./detail-of-a-dental-tools-attached-to-a-dental-chai-2026-01-09-11-06-26-utc.jpg",
    "./a-sexy-hot-redhead-dentist-woman-taking-care-of-h-2026-01-07-01-18-20-utc.jpg",
    "./woman-holds-aligners-in-dentistry-while-sitting-in-2026-01-08-07-50-11-utc.jpg",
    "./close-up-shot-of-glad-satisfied-woman-being-happy-2026-01-08-05-22-29-utc.jpg",
    "./young-female-dentist-in-dental-office-dentist-at-2026-01-09-06-51-47-utc.jpg",
    "./with-the-help-of-high-tech-equipment-and-expert-sk-2026-01-05-04-52-49-utc.jpg",
    "./female-dentist-with-assistant-working-in-dental-cl-2026-01-07-07-00-33-utc.jpg",
  ],
};

const TEAM = [
  {
    name: "Dr. Andrei Popescu",
    role: "Stomatolog generalist, 10+ ani experiență",
    img: "./young-female-dentist-in-dental-office-dentist-at-2026-01-09-06-51-47-utc.jpg",
  },
  {
    name: "Dr. Maria Ionescu",
    role: "Estetică dentară & protetică, abordare minimalistă",
    img: "./a-sexy-hot-redhead-dentist-woman-taking-care-of-h-2026-01-07-01-18-20-utc.jpg",
  },
  {
    name: "Dr. Radu Stan",
    role: "Endodonție & urgențe, focus pe confort",
    img: "./female-dentist-with-assistant-working-in-dental-cl-2026-01-07-07-00-33-utc.jpg",
  },
];

const SERVICE_CHIPS = [
  { title: "Profilaxie", sub: "Detartraj + airflow" },
  { title: "Generală", sub: "Obturații, consultații" },
  { title: "Endodonție", sub: "Canal cu precizie" },
  { title: "Estetică", sub: "Albire, zâmbet natural" },
  { title: "Protetică", sub: "Coroane, punți" },
  { title: "Implantologie", sub: "Plan clar, stabil" },
  { title: "Pedodonție", sub: "Abordare blândă" },
  { title: "Ortodonție", sub: "Aliniere, ghidaj" },
];

const TESTIMONIALS = [
  { quote: "Am uitat de frica de dentist. Echipă excelentă.", author: "A.R." },
  { quote: "Totul curat, rapid, explicat pe înțeles. Recomand.", author: "M.D." },
  { quote: "Consultație eficientă, plan clar, fără presiune.", author: "I.C." },
  { quote: "Foarte atent la confort. Zero stres în timpul tratamentului.", author: "S.P." },
  { quote: "Rezultatul estetic arată natural. Fix ce mi-am dorit.", author: "L.N." },
];

function qs(sel, root = document) {
  return root.querySelector(sel);
}

function qsa(sel, root = document) {
  return Array.from(root.querySelectorAll(sel));
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function initNavProgressDots() {
  const dotsWrap = qs(".nav-progress-dots");
  if (!dotsWrap) return;

  dotsWrap.innerHTML = "";
  for (const s of SECTIONS) {
    const dot = document.createElement("div");
    dot.className = "nav-dot";
    dot.dataset.target = s.id;
    dotsWrap.appendChild(dot);
  }
}

function updateActiveSection() {
  const scrollY = window.scrollY || 0;
  const nav = qs(".sticky-nav");
  if (nav) nav.classList.toggle("is-shrunk", scrollY > 18);

  // Parallax subtle
  const parallax = qs(".parallax-bg");
  if (parallax) {
    const y = clamp(scrollY * 0.04, 0, 24);
    parallax.style.setProperty("--parallax", `${y}px`);
  }

  const offsets = SECTIONS.map(({ id }) => {
    const el = document.getElementById(id);
    if (!el) return { id, top: Number.POSITIVE_INFINITY };
    const rect = el.getBoundingClientRect();
    return { id, top: rect.top };
  });

  // Choose nearest section top to viewport top (bias slightly for sticky nav)
  const bias = 120;
  let best = offsets[0]?.id;
  let bestScore = Number.POSITIVE_INFINITY;
  for (const o of offsets) {
    const score = Math.abs(o.top - bias);
    if (score < bestScore) {
      bestScore = score;
      best = o.id;
    }
  }

  qsa(".nav-dot").forEach((d) => d.classList.toggle("is-active", d.dataset.target === best));
}

function bindSmoothScroll() {
  qsa("[data-scroll]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-scroll");
      if (!target) return;
      const el = qs(target);
      if (!el) return;
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function initReveal() {
  const els = qsa(".reveal");
  if (!els.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      }
    },
    { root: null, threshold: 0.12 },
  );

  els.forEach((el) => io.observe(el));
}

function makeServicesMarquee() {
  const host = qs('.services-marquee .infinite-row[data-kind="services"]');
  if (!host) return;
  host.innerHTML = "";
  for (const s of SERVICE_CHIPS) {
    const item = document.createElement("div");
    item.className = "carousel-item service-chip";
    item.setAttribute("role", "listitem");
    item.innerHTML = `<div class="chip-title">${s.title}</div><div class="chip-sub">${s.sub}</div>`;
    host.appendChild(item);
  }
}

function makeTeamCarousel() {
  const host = qs('.carousel-scroll[data-kind="team"]');
  if (!host) return;
  host.innerHTML = "";
  for (const d of TEAM) {
    const wrap = document.createElement("div");
    wrap.className = "carousel-item team";
    wrap.setAttribute("role", "listitem");
    wrap.innerHTML = `
      <div class="team-card">
        <img loading="lazy" decoding="async" src="${d.img}" alt="${d.name}" />
        <div class="team-meta">
          <h3>${d.name}</h3>
          <p>${d.role}</p>
        </div>
      </div>
    `;
    host.appendChild(wrap);
  }
}

function makeTestimonialsLine() {
  const host = qs('.infinite-line-carousel .infinite-row[data-kind="testimonials"]');
  if (!host) return;
  host.innerHTML = "";
  for (const t of TESTIMONIALS) {
    const item = document.createElement("div");
    item.className = "carousel-item testimonial";
    item.setAttribute("role", "listitem");
    item.innerHTML = `
      <div class="testimonial">
        <p>"${t.quote}"</p>
        <div class="stars">★★★★★ ${t.author}</div>
      </div>
    `;
    host.appendChild(item);
  }
}

function makeGallery() {
  const grid = qs(".masonry-grid");
  if (!grid) return;
  grid.innerHTML = "";

  const images = ASSETS.gallery;
  images.forEach((src, idx) => {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "gallery-item";
    item.setAttribute("aria-label", `Deschide imaginea ${idx + 1}`);
    item.dataset.src = src;
    item.dataset.caption = "Galerie Miradent";

    const img = document.createElement("img");
    img.loading = "lazy";
    img.decoding = "async";
    img.src = src;
    img.alt = "Imagine galerie";
    item.appendChild(img);
    grid.appendChild(item);
  });
}

function openLightbox(src, caption) {
  const lb = qs("#lightbox");
  const img = qs(".lightbox-img", lb);
  const cap = qs("#lightbox-caption", lb);
  if (!lb || !img || !cap) return;

  img.src = src;
  img.alt = caption || "";
  cap.textContent = caption || "";
  lb.classList.add("is-open");
  lb.setAttribute("aria-hidden", "false");
}

function closeLightbox() {
  const lb = qs("#lightbox");
  const img = qs(".lightbox-img", lb);
  if (!lb || !img) return;
  lb.classList.remove("is-open");
  lb.setAttribute("aria-hidden", "true");
  img.src = "";
}

function bindLightbox() {
  document.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;

    const btn = target.closest(".gallery-item");
    if (btn) {
      openLightbox(btn.dataset.src, btn.dataset.caption);
      return;
    }

    if (target.matches("#lightbox") || target.closest(".lightbox-close")) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });
}

function initInfiniteAutoScrollRow(el, speed = 0.25) {
  // speed is pixels per frame approximation (tuned for 60fps)
  if (!el) return;

  // Duplicate content once for seamless looping.
  const original = Array.from(el.children);
  if (!original.length) return;
  original.forEach((n) => el.appendChild(n.cloneNode(true)));

  let raf = 0;
  let running = true;

  const tick = () => {
    if (running) {
      el.scrollLeft += speed;
      const half = el.scrollWidth / 2;
      if (el.scrollLeft >= half) el.scrollLeft -= half;
    }
    raf = requestAnimationFrame(tick);
  };

  const pause = () => {
    running = false;
  };
  const resume = () => {
    running = true;
  };

  el.addEventListener("pointerdown", pause);
  el.addEventListener("pointerup", resume);
  el.addEventListener("pointercancel", resume);
  el.addEventListener("mouseenter", pause);
  el.addEventListener("mouseleave", resume);

  raf = requestAnimationFrame(tick);

  // Return cleanup in case needed.
  return () => cancelAnimationFrame(raf);
}

function bindDragScroll(el) {
  if (!el) return;
  let isDown = false;
  let startX = 0;
  let startLeft = 0;

  el.addEventListener("pointerdown", (e) => {
    isDown = true;
    startX = e.clientX;
    startLeft = el.scrollLeft;
    el.setPointerCapture(e.pointerId);
  });

  el.addEventListener("pointermove", (e) => {
    if (!isDown) return;
    const dx = e.clientX - startX;
    el.scrollLeft = startLeft - dx;
  });

  el.addEventListener("pointerup", () => {
    isDown = false;
  });
  el.addEventListener("pointercancel", () => {
    isDown = false;
  });
}

function bindAppointmentForm() {
  const form = qs("#appointment-form");
  const status = qs("#form-status");
  if (!form || !status) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const nume = String(fd.get("nume") || "").trim();
    const telefon = String(fd.get("telefon") || "").trim();
    const serviciu = String(fd.get("serviciu") || "").trim();
    const mesaj = String(fd.get("mesaj") || "").trim();

    if (!nume || !telefon || !mesaj) {
      status.textContent = "Completează câmpurile obligatorii.";
      return;
    }

    const subject = encodeURIComponent("Programare Miradent Sector 3");
    const body = encodeURIComponent(
      `Nume: ${nume}\nTelefon: ${telefon}\nServiciu: ${serviciu}\n\nMesaj:\n${mesaj}\n\nAdresă: Strada Vlaicu Vodă 16, Sector 3, București`,
    );

    // No-backend behavior: open mail client + show confirmation.
    window.location.href = `mailto:programari@miradent.ro?subject=${subject}&body=${body}`;
    status.textContent = "Cererea a fost pregătită pentru trimitere. Confirmarea se face telefonic.";
    form.reset();
  });
}

function init() {
  initNavProgressDots();
  updateActiveSection();

  bindSmoothScroll();
  initReveal();

  makeServicesMarquee();
  makeTeamCarousel();
  makeTestimonialsLine();
  makeGallery();

  bindLightbox();
  bindAppointmentForm();

  const servicesRow = qs('.services-marquee .infinite-row[data-kind="services"]');
  const teamRow = qs('.carousel-scroll[data-kind="team"]');
  const testRow = qs('.infinite-line-carousel .infinite-row[data-kind="testimonials"]');

  [servicesRow, teamRow, testRow].forEach((row) => bindDragScroll(row));

  initInfiniteAutoScrollRow(servicesRow, 0.35);
  initInfiniteAutoScrollRow(teamRow, 0.2);
  initInfiniteAutoScrollRow(testRow, 0.3);

  window.addEventListener("scroll", updateActiveSection, { passive: true });
}

document.addEventListener("DOMContentLoaded", init);

