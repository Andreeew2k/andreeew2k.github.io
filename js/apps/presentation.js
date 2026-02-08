// js/apps/presentation.js
document.addEventListener("DOMContentLoaded", () => {
  window.Apps = window.Apps || {};

  function openPresentation() {
    const tpl = document.getElementById("presentation-template");
    if (!tpl) return console.error("❌ Presentation template missing");

    const existing = document.querySelector(".presentation-window");
    if (existing) {
      existing.style.display = "flex";
      bringToFront(existing);
      return;
    }

    const win = tpl.content.firstElementChild.cloneNode(true);
    win.style.display = "flex";

    Object.assign(win.style, {
      position: "fixed",
      top: "0",
      left: "0",
      right: "0",
      bottom: "0",
      width: "100%",
      height: "100%",
      margin: "0",
      borderRadius: "0",
      zIndex: "9999"
    });

    const titleEl = win.querySelector(".presentation-title");
    const subtitleEl = win.querySelector(".presentation-subtitle");
    const bodyEl = win.querySelector(".presentation-body");
    const statusEl = win.querySelector(".presentation-status");
    const prevBtn = win.querySelector(".presentation-prev");
    const enterBtn = win.querySelector(".presentation-enter");
    const exitBtn = win.querySelector(".presentation-exit");
    const nextBtn = win.querySelector(".presentation-next");

    let slides = [];
    let slideIndex = 0;

    function renderSlide() {
      const slide = slides[slideIndex];
      if (!slide) return;

      titleEl.textContent = slide.title || "";
      subtitleEl.textContent = slide.subtitle || "";
      subtitleEl.style.display = slide.subtitle ? "block" : "none";

      bodyEl.innerHTML = "";
      if (Array.isArray(slide.bullets)) {
        const list = document.createElement("ul");
        slide.bullets.forEach(text => {
          const item = document.createElement("li");
          item.textContent = text;
          list.appendChild(item);
        });
        bodyEl.appendChild(list);
      } else if (slide.body) {
        const paragraph = document.createElement("p");
        paragraph.textContent = slide.body;
        bodyEl.appendChild(paragraph);
      }

      statusEl.textContent = `Slide ${slideIndex + 1} of ${slides.length}`;
      prevBtn.disabled = slideIndex === 0;
      nextBtn.disabled = slideIndex === slides.length - 1;
    }

    function isFullscreen() {
      return document.fullscreenElement === win;
    }

    function updateFullscreenButtons() {
      const full = isFullscreen();
      enterBtn.disabled = full;
      exitBtn.disabled = !full;
    }

    function triggerCrt(mode) {
      const className = mode === "off" ? "crt-off" : "crt-on";
      win.classList.remove("crt-on", "crt-off");
      void win.offsetWidth;
      win.classList.add(className);
      setTimeout(() => win.classList.remove(className), 700);
    }

    function requestFullscreen() {
      if (isFullscreen()) return;
      if (win.requestFullscreen) {
        triggerCrt("on");
        win.requestFullscreen().catch(err => console.warn(err));
      }
    }

    function exitFullscreen() {
      if (!isFullscreen()) return;
      if (document.exitFullscreen) {
        triggerCrt("off");
        document.exitFullscreen().catch(err => console.warn(err));
      }
    }

    function nextSlide() {
      if (slideIndex < slides.length - 1) {
        slideIndex += 1;
        renderSlide();
      }
    }

    function prevSlide() {
      if (slideIndex > 0) {
        slideIndex -= 1;
        renderSlide();
      }
    }

    prevBtn.addEventListener("click", e => {
      e.stopPropagation();
      prevSlide();
    });

    enterBtn.addEventListener("click", e => {
      e.stopPropagation();
      requestFullscreen();
    });

    exitBtn.addEventListener("click", e => {
      e.stopPropagation();
      exitFullscreen();
    });

    nextBtn.addEventListener("click", e => {
      e.stopPropagation();
      nextSlide();
    });

    win.addEventListener("click", e => {
      if (e.target.closest(".title-bar") || e.target.closest(".presentation-controls")) {
        return;
      }
      nextSlide();
    });

    function handleKeydown(e) {
      if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") {
        nextSlide();
      }
      if (e.key === "ArrowLeft" || e.key === "PageUp") {
        prevSlide();
      }
      if (e.key === "f" || e.key === "F11") {
        e.preventDefault();
        requestFullscreen();
      }
      if (e.key === "Escape") {
        exitFullscreen();
      }
    }

    document.addEventListener("keydown", handleKeydown);
    document.addEventListener("fullscreenchange", updateFullscreenButtons);

    win.querySelector(".close-btn").addEventListener("click", () => {
      if (window.SoundFX) window.SoundFX.click?.();
      document.removeEventListener("fullscreenchange", updateFullscreenButtons);
      document.removeEventListener("keydown", handleKeydown);
      if (isFullscreen()) {
        document.exitFullscreen().catch(err => console.warn(err));
      }
      win.remove();
    });

    document.body.appendChild(win);
    bringToFront(win);
    triggerCrt("on");
    updateFullscreenButtons();

    fetch("presentation/slides.json")
      .then(res => {
        if (!res.ok) throw new Error("Failed to load slides");
        return res.json();
      })
      .then(data => {
        slides = Array.isArray(data.slides) ? data.slides : [];
        if (!slides.length) {
          throw new Error("No slides found");
        }
        renderSlide();
      })
      .catch(err => {
        titleEl.textContent = "Unable to load presentation";
        subtitleEl.style.display = "none";
        bodyEl.textContent = "Check presentation/slides.json for slide data.";
        statusEl.textContent = "";
        console.error(err);
      });
  }

  window.Apps.Presentation = { open: openPresentation };

  const icon = document.getElementById("presentation-icon");
  if (icon) {
    const handler = () => {
      if (window.SoundFX) {
        window.SoundFX.click?.();
      }
      openPresentation();
    };
    if (/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      icon.addEventListener("click", handler);
    } else {
      icon.addEventListener("dblclick", handler);
    }
  }
});
