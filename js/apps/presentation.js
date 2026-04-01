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
    const fullscreenBtn = win.querySelector(".presentation-fullscreen");
    const exitBtn = win.querySelector(".presentation-exit");
    const nextBtn = win.querySelector(".presentation-next");
    const bootOverlay = win.querySelector(".presentation-boot");
    const pinOverlay = win.querySelector(".presentation-pin");
    const pinInput = win.querySelector(".presentation-pin-input");
    const pinSubmit = win.querySelector(".presentation-pin-submit");
    const pinMessage = win.querySelector(".presentation-pin-message");

    let slides = [];
    let slideIndex = 0;
    let isLocked = true;

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
      fullscreenBtn.textContent = full ? "Fullscreen On" : "Fullscreen Off";
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
      if (isLocked) return;
      if (slideIndex < slides.length - 1) {
        slideIndex += 1;
        renderSlide();
      }
    }

    function prevSlide() {
      if (isLocked) return;
      if (slideIndex > 0) {
        slideIndex -= 1;
        renderSlide();
      }
    }

    function showPinMessage(message) {
      pinMessage.textContent = message;
    }

    function unlockDeck() {
      isLocked = false;
      win.classList.remove("presentation-locked");
      pinOverlay.classList.add("hidden");
      showPinMessage("");
      renderSlide();
    }

    function handlePinSubmit() {
      if (pinInput.value === "1337") {
        unlockDeck();
      } else {
        showPinMessage("Access denied");
        pinInput.value = "";
        pinInput.focus();
      }
    }

    prevBtn.addEventListener("click", e => {
      e.stopPropagation();
      prevSlide();
    });

    fullscreenBtn.addEventListener("click", e => {
      e.stopPropagation();
      if (isFullscreen()) {
        exitFullscreen();
      } else {
        requestFullscreen();
      }
    });

    exitBtn.addEventListener("click", e => {
      e.stopPropagation();
      if (isFullscreen()) {
        exitFullscreen();
      }
      closeWindow();
    });

    nextBtn.addEventListener("click", e => {
      e.stopPropagation();
      nextSlide();
    });

    win.addEventListener("click", e => {
      if (e.target.closest(".presentation-controls")) {
        return;
      }
      nextSlide();
    });

    function handleKeydown(e) {
      if (isLocked && e.key === "Enter") {
        handlePinSubmit();
        return;
      }
      if (isLocked) return;
      if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") {
        nextSlide();
      }
      if (e.key === "ArrowLeft" || e.key === "PageUp") {
        prevSlide();
      }
      if (e.key === "f" || e.key === "F11") {
        e.preventDefault();
        if (isFullscreen()) {
          exitFullscreen();
        } else {
          requestFullscreen();
        }
      }
      if (e.key === "Escape") {
        if (isFullscreen()) {
          exitFullscreen();
        }
        closeWindow();
      }
    }

    document.addEventListener("keydown", handleKeydown);
    document.addEventListener("fullscreenchange", updateFullscreenButtons);

    function closeWindow() {
      if (window.SoundFX) window.SoundFX.click?.();
      document.removeEventListener("fullscreenchange", updateFullscreenButtons);
      document.removeEventListener("keydown", handleKeydown);
      if (isFullscreen()) {
        document.exitFullscreen().catch(err => console.warn(err));
      }
      win.remove();
    }

    pinSubmit.addEventListener("click", handlePinSubmit);
    pinInput.addEventListener("keydown", e => {
      if (e.key === "Enter") handlePinSubmit();
    });

    document.body.appendChild(win);
    bringToFront(win);
    updateFullscreenButtons();
    win.classList.add("presentation-locked");
    pinOverlay.classList.add("hidden");
    pinInput.value = "";
    showPinMessage("");
    bootOverlay.classList.remove("hidden");
    setTimeout(() => {
      triggerCrt("on");
      bootOverlay.classList.add("hidden");
      pinOverlay.classList.remove("hidden");
      pinInput.focus();
    }, 600);

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
    const presentationUrl = "https://1drv.ms/p/c/3926b3560b2a381a/IQAmtWvVGz7sRKaNNF58NEd4AeStj9VbcJJ4uj7_Y3hlt3w?e=1KgzhB";
    const handler = () => {
      if (window.SoundFX) {
        window.SoundFX.click?.();
      }
      window.open(presentationUrl, "_blank", "noopener,noreferrer");
    };
    if (/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      icon.addEventListener("click", handler);
    } else {
      icon.addEventListener("dblclick", handler);
    }
  }
});
