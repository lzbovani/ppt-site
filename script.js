const body = document.body;
const entry = document.querySelector("#entry");
const startButton = document.querySelector("#startButton");
const audio = document.querySelector("#bgMusic");
const audioButton = document.querySelector("#audioButton");
const dots = [...document.querySelectorAll(".memory-dots a")];
const scenes = [...document.querySelectorAll(".memory-scene")];
const revealItems = [...document.querySelectorAll(".reveal")];
const lightbox = document.querySelector("#lightbox");
const lightboxImage = lightbox.querySelector("img");
const lightboxClose = document.querySelector("#lightboxClose");

body.classList.add("is-locked");

const setAudioButtonState = () => {
  const isPaused = audio.paused;
  audioButton.classList.toggle("is-muted", isPaused);
  audioButton.setAttribute("aria-pressed", String(!isPaused));
  audioButton.textContent = isPaused ? "Música" : "Música baixa";
};

const prepareAudio = () => {
  if (!audio.getAttribute("src")) {
    audio.src = audio.dataset.src;
  }

  audio.volume = 0.18;
  return audio.play();
};

const startExperience = async () => {
  entry.classList.add("is-hidden");
  body.classList.remove("is-locked");
  window.scrollTo({ top: 0, behavior: "smooth" });

  try {
    await prepareAudio();
  } catch (error) {
    audioButton.textContent = "Adicionar música";
    audioButton.classList.add("is-muted");
  }

  setAudioButtonState();
};

startButton.addEventListener("click", startExperience);

audioButton.addEventListener("click", async () => {
  if (audio.paused) {
    try {
      await prepareAudio();
    } catch (error) {
      audioButton.textContent = "Adicionar música";
      audioButton.classList.add("is-muted");
      return;
    }
  } else {
    audio.pause();
  }

  setAudioButtonState();
});

audio.addEventListener("play", setAudioButtonState);
audio.addEventListener("pause", setAudioButtonState);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entryItem) => {
      if (entryItem.isIntersecting) {
        entryItem.target.classList.add("is-visible");
      }
    });
  },
  { threshold: 0.2 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const sceneObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entryItem) => {
      if (!entryItem.isIntersecting) return;

      const index = scenes.indexOf(entryItem.target);
      dots.forEach((dot, dotIndex) => {
        dot.classList.toggle("is-active", dotIndex === index);
      });
    });
  },
  {
    rootMargin: "-35% 0px -55% 0px",
    threshold: 0
  }
);

scenes.forEach((scene) => sceneObserver.observe(scene));

document.querySelectorAll("[data-lightbox]").forEach((button) => {
  button.addEventListener("click", () => {
    lightboxImage.src = button.dataset.lightbox;
    lightboxImage.alt = button.querySelector("img").alt;
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
  });
});

const closeLightbox = () => {
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImage.src = "";
};

lightboxClose.addEventListener("click", closeLightbox);

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
    closeLightbox();
  }
});
