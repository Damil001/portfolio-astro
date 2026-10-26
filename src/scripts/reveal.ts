const cardSelector = ".project-card, .service, .quote, .timeline";
const riseSelector = ".hero .actions, .footer-stack .actions, .socials, .faq";

function reducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function byPosition(a: Element, b: Element) {
  const ra = a.getBoundingClientRect();
  const rb = b.getBoundingClientRect();
  return ra.top - rb.top || ra.left - rb.left;
}

function showGroup(elements: HTMLElement[], observer: IntersectionObserver) {
  const pending = elements.filter((el) => !el.classList.contains("is-shown"));
  pending.sort(byPosition);
  pending.forEach((el, index) => {
    el.style.transitionDelay = `${Math.min(index, 4) * 50}ms`;
    el.classList.add("is-shown");
    observer.unobserve(el);
  });
}

function startIntroMask() {
  const headings = [...document.querySelectorAll<HTMLElement>(".stack h2")];
  if (!headings.length) return;

  let running = true;
  let frame = 0;

  const paint = () => {
    frame = 0;
    if (!running) return;
    for (const el of headings) {
      const next = `${-Math.round(el.getBoundingClientRect().top)}px`;
      if (el.style.getPropertyValue("--mask-y") !== next) el.style.setProperty("--mask-y", next);
    }
  };

  const schedule = () => {
    if (!running || frame) return;
    frame = window.requestAnimationFrame(paint);
  };

  const stack = headings[0].closest(".stack");
  if (stack) {
    const watch = new IntersectionObserver(
      ([entry]) => {
        running = entry.isIntersecting;
        if (running) schedule();
      },
      { rootMargin: "25% 0px" },
    );
    watch.observe(stack);
  }

  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });
  paint();
}

function startMarquee() {
  const rows = [...document.querySelectorAll<HTMLElement>(".service-card-marquee-row")];
  if (!rows.length) return;

  const tracks = rows.flatMap((row) => [...row.querySelectorAll<HTMLElement>(".service-card-marquee-track")]);
  const watch = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const playing = entry.isIntersecting;
        entry.target.querySelectorAll<HTMLElement>(".service-card-marquee-track").forEach((track) => {
          track.classList.toggle("is-running", playing);
        });
      }
    },
    { rootMargin: "15% 0px" },
  );

  rows.forEach((row) => watch.observe(row));
  if (!tracks.length) return;
}

export function startReveals() {
  if (reducedMotion()) return;

  startIntroMask();
  startMarquee();

  const cards = [...document.querySelectorAll<HTMLElement>(cardSelector)];
  const rises = [...document.querySelectorAll<HTMLElement>(riseSelector)];
  const watched = [...cards, ...rises];

  const observer = new IntersectionObserver(
    (entries) => {
      const hit = entries.filter((entry) => entry.isIntersecting).map((entry) => entry.target as HTMLElement);
      if (hit.length) showGroup(hit, observer);
    },
    { threshold: 0.12, rootMargin: "0px 0px 6% 0px" },
  );

  const onScreen = (el: HTMLElement) => {
    const box = el.getBoundingClientRect();
    return box.top < window.innerHeight * 0.94 && box.bottom > 32;
  };

  window.requestAnimationFrame(() => {
    const visible: HTMLElement[] = [];
    watched.forEach((el) => {
      if (onScreen(el)) visible.push(el);
      else observer.observe(el);
    });
    showGroup(visible, observer);
  });
}
