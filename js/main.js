// MedTech Robotics: site scripts (no dependencies)

document.addEventListener("DOMContentLoaded", () => {
  // ---- Footer year ----
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // ---- Mobile navigation ----
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");

  const setNav = (open) => {
    nav.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };

  if (toggle && nav) {
    toggle.addEventListener("click", () => setNav(!nav.classList.contains("open")));
    nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setNav(false)));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("open")) {
        setNav(false);
        toggle.focus();
      }
    });
  }

  // ---- Activity gallery (auto-scrolling) ----
  buildGallery(window.GALLERY || []);

  // ---- Contact form (FormSubmit) ----
  const form = document.getElementById("contact-form");
  if (!form) return;

  const status = document.getElementById("form-status");
  const button = form.querySelector('button[type="submit"]');
  const buttonText = button.textContent;

  const showStatus = (type, text) => {
    status.className = `form-status ${type}`;
    status.textContent = text;
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Simple client-side validation
    const fields = [...form.querySelectorAll("input[required], textarea[required]")];
    let firstInvalid = null;
    fields.forEach((f) => {
      const ok = f.checkValidity() && f.value.trim() !== "";
      f.classList.toggle("invalid", !ok);
      f.setAttribute("aria-invalid", String(!ok));
      if (!ok && !firstInvalid) firstInvalid = f;
    });
    if (firstInvalid) {
      showStatus("error", "Please fill in your name, a valid email and a message.");
      firstInvalid.focus();
      return;
    }

    button.disabled = true;
    button.textContent = "Sending…";
    showStatus("", "");

    try {
      const res = await fetch(form.action, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && String(data.success) === "true") {
        showStatus("success", "Thanks! Your message has been sent. We'll get back to you soon.");
        form.reset();
        fields.forEach((f) => f.removeAttribute("aria-invalid"));
      } else {
        showStatus("error", data.message || "Something went wrong. Please try again later.");
      }
    } catch {
      showStatus("error", "Network error. Please check your connection and try again.");
    } finally {
      button.disabled = false;
      button.textContent = buttonText;
    }
  });
});

// Builds the infinite photo strip from window.GALLERY (js/gallery-data.js).
// The photo set is repeated so it's wider than the screen, then doubled; the CSS
// animation slides it left by exactly 50%, so the loop has no visible seam.
function buildGallery(photos) {
  const section = document.getElementById("gallery");
  const track = section && section.querySelector(".gallery-track");
  if (!track || photos.length === 0) {
    document.querySelector("[data-gallery-link]")?.remove();
    return;
  }

  const height = 300; // approx display height, used only to estimate widths
  const gap = 16;
  const widthOf = (p) => (p.width / p.height) * height + gap;
  const setWidth = photos.reduce((sum, p) => sum + widthOf(p), 0);
  const minWidth = Math.max(window.innerWidth, 1600);
  const repeats = Math.max(1, Math.ceil(minWidth / setWidth));

  const makeItem = (p, hidden) => {
    const li = document.createElement("li");
    li.className = "gallery-item";
    if (hidden) li.setAttribute("aria-hidden", "true"); // screen readers hear each photo once
    li.innerHTML = `<figure><img loading="lazy" decoding="async"></figure>`;
    const img = li.querySelector("img");
    img.src = p.src;
    img.width = p.width;
    img.height = p.height;
    img.alt = hidden ? "" : p.alt;
    const cap = document.createElement("figcaption");
    cap.textContent = p.alt;
    li.querySelector("figure").append(cap);
    return li;
  };

  const frag = document.createDocumentFragment();
  for (let copy = 0; copy < repeats * 2; copy++) {
    photos.forEach((p) => frag.append(makeItem(p, copy > 0)));
  }
  track.append(frag);

  // Constant speed (~40px/s) no matter how many photos there are
  track.style.setProperty("--duration", `${(setWidth * repeats) / 40}s`);
  section.hidden = false;
}
