const opening = document.getElementById("opening");
const openButton = document.getElementById("openInvitation");
const music = document.getElementById("weddingMusic");
const musicBtn = document.getElementById("musicBtn");

openButton.addEventListener("click", async () => {
  opening.classList.add("hide");
  document.body.style.overflow = "auto";
  musicBtn.classList.add("show");

  try {
    await music.play();
    musicBtn.classList.add("playing");
  } catch (e) {
    // Browser may block playback; the music button remains available.
  }
});

musicBtn.addEventListener("click", async () => {
  if (music.paused) {
    await music.play();
    musicBtn.classList.add("playing");
  } else {
    music.pause();
    musicBtn.classList.remove("playing");
  }
});

// Countdown: 25 June 2033, 00:00 local time.
const weddingDate = new Date("2033-06-25T00:00:00+07:00").getTime();

function updateCountdown() {
  const now = Date.now();
  let distance = weddingDate - now;

  if (distance < 0) distance = 0;

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((distance / (1000 * 60)) % 60);
  const seconds = Math.floor((distance / 1000) % 60);

  document.getElementById("days").textContent = days;
  document.getElementById("hours").textContent = hours;
  document.getElementById("minutes").textContent = minutes;
  document.getElementById("seconds").textContent = seconds;
}
updateCountdown();
setInterval(updateCountdown, 1000);

// Reveal-on-scroll animation.
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

// Gallery lightbox.
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const closeLightbox = document.getElementById("closeLightbox");

document.querySelectorAll(".gallery-item").forEach(item => {
  item.addEventListener("click", () => {
    lightboxImage.src = item.dataset.img;
    lightbox.classList.add("show");
    document.body.style.overflow = "hidden";
  });
});

function closeGallery() {
  lightbox.classList.remove("show");
  document.body.style.overflow = "auto";
}
closeLightbox.addEventListener("click", closeGallery);
lightbox.addEventListener("click", e => {
  if (e.target === lightbox) closeGallery();
});

// Simple local RSVP / wishes.
// Entries remain in the browser only. Replace with a backend or Google Form
// if you want guests' messages to be collected online.
const form = document.getElementById("rsvpForm");
const wishList = document.getElementById("wishList");

function renderWishes() {
  const wishes = JSON.parse(localStorage.getItem("cacaAhmadWishes") || "[]");
  wishList.innerHTML = wishes.map(w => `
    <div class="wish">
      <strong>${escapeHtml(w.name)}</strong>
      <small>${escapeHtml(w.attendance)}</small>
      <p>${escapeHtml(w.message)}</p>
    </div>
  `).join("");
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

form.addEventListener("submit", e => {
  e.preventDefault();

  const wishes = JSON.parse(localStorage.getItem("cacaAhmadWishes") || "[]");
  wishes.unshift({
    name: document.getElementById("guestName").value.trim(),
    attendance: document.getElementById("attendance").value,
    message: document.getElementById("message").value.trim()
  });

  localStorage.setItem("cacaAhmadWishes", JSON.stringify(wishes.slice(0, 30)));
  form.reset();
  renderWishes();
  alert("Terima kasih atas ucapan dan doanya 🤍");
});

renderWishes();


// Luxury prewedding slider — one photo at a time.
const slides = [...document.querySelectorAll(".prewed-slide")];
const dotsWrap = document.getElementById("sliderDots");
const prevSlide = document.getElementById("prevSlide");
const nextSlide = document.getElementById("nextSlide");
const slideNumber = document.getElementById("slideNumber");
const slideCaption = document.getElementById("slideCaption");

const slideCaptions = [
  "Satu langkah, satu doa, satu tujuan.",
  "Di antara keramaian, kami menemukan satu sama lain.",
  "Ada tatapan yang menyimpan banyak doa.",
  "Pelukan yang kelak ingin kami jadikan rumah.",
  "Bersama, menuju halaman berikutnya.",
  "Jarak pernah jauh, tetapi hati tetap dekat.",
  "Dua perjalanan yang akhirnya berjalan ke arah yang sama.",
  "Mekkah menjadi saksi dari banyak harapan.",
  "Caca — menatap masa depan dengan doa.",
  "Ahmad — menunggu hari ketika jarak benar-benar berakhir."
];

let currentSlide = 0;
let sliderTimer;

function buildDots() {
  if (!dotsWrap) return;
  dotsWrap.innerHTML = "";
  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.className = "slider-dot" + (i === 0 ? " active" : "");
    dot.type = "button";
    dot.setAttribute("aria-label", `Foto ${i + 1}`);
    dot.addEventListener("click", () => goToSlide(i, true));
    dotsWrap.appendChild(dot);
  });
}

function goToSlide(index, manual = false) {
  if (!slides.length) return;
  currentSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => slide.classList.toggle("active", i === currentSlide));
  document.querySelectorAll(".slider-dot").forEach((dot, i) => {
    dot.classList.toggle("active", i === currentSlide);
  });
  if (slideNumber) slideNumber.textContent = String(currentSlide + 1).padStart(2, "0");
  if (slideCaption) slideCaption.textContent = slideCaptions[currentSlide] || "Satu langkah, satu doa, satu tujuan.";
  if (manual) restartSlider();
}

function restartSlider() {
  clearInterval(sliderTimer);
  sliderTimer = setInterval(() => goToSlide(currentSlide + 1), 5000);
}

buildDots();
goToSlide(0);
restartSlider();

prevSlide?.addEventListener("click", () => goToSlide(currentSlide - 1, true));
nextSlide?.addEventListener("click", () => goToSlide(currentSlide + 1, true));

// Pause autoplay while hovering/focusing the slider.
const slider = document.getElementById("prewedSlider");
slider?.addEventListener("mouseenter", () => clearInterval(sliderTimer));
slider?.addEventListener("mouseleave", restartSlider);
slider?.addEventListener("focusin", () => clearInterval(sliderTimer));
slider?.addEventListener("focusout", restartSlider);

// DANA copy button.
const copyDana = document.getElementById("copyDana");
const danaNumber = document.getElementById("danaNumber");
const copyStatus = document.getElementById("copyStatus");

copyDana?.addEventListener("click", async () => {
  const number = danaNumber?.textContent.trim() || "087871475059";
  try {
    await navigator.clipboard.writeText(number);
    copyStatus.textContent = "Nomor DANA berhasil disalin ✦";
  } catch (e) {
    // Fallback for local/file browser environments.
    const temp = document.createElement("textarea");
    temp.value = number;
    document.body.appendChild(temp);
    temp.select();
    document.execCommand("copy");
    temp.remove();
    copyStatus.textContent = "Nomor DANA berhasil disalin ✦";
  }
  setTimeout(() => {
    copyStatus.textContent = "";
  }, 2500);
});
