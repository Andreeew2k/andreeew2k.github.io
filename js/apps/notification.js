function monthsUntilContractEnd() {
const today = new Date();
const end = new Date(today.getFullYear(), 0, 10); // Sept = month 8 (0-indexed), pick Sept 30

// If we've already passed September this year → count until next year
if (today > end) {
    end.setFullYear(end.getFullYear() + 1);
}

// Calculate difference in months
let months =
    (end.getFullYear() - today.getFullYear()) * 12 +
    (end.getMonth() - today.getMonth());

if (months <= 0) {
    return "less than 1 month";
} else if (months === 1) {
    return "1 month";
} else {
    return `${months} months`;
}
}

function spawnNotification() {
const tpl = document.getElementById("notify-template");
if (!tpl) return;

if (document.querySelector(".notify-window")) return;

const win = tpl.content.firstElementChild.cloneNode(true);
win.style.display = "block";
document.body.appendChild(win);

// Insert dynamic contract countdown
const counterEl = win.querySelector(".contract-counter");
if (counterEl) {
    counterEl.textContent = monthsUntilContractEnd();
}

// Center & recenter on resize/orientation
function centerWindow() {
    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;
    const winW = win.offsetWidth || 320;
    const winH = win.offsetHeight || 150;
    win.style.left = (viewportW - winW) / 2 + "px";
    win.style.top = (viewportH - winH) / 2 + "px";
}
centerWindow();
window.addEventListener("resize", centerWindow);
window.addEventListener("orientationchange", centerWindow);

// Play error sound
if (window.SoundFX) {
    window.SoundFX.error?.();
}

// Close handlers
win.querySelector(".close-btn").addEventListener("click", () => {
    if (window.SoundFX) window.SoundFX.click?.();
    win.remove();
});
win.querySelector(".notify-close").addEventListener("click", () => {
    if (window.SoundFX) window.SoundFX.click?.();
    win.remove();
});

// Make draggable
if (typeof makeDraggable === "function") makeDraggable(win);
if (typeof bringToFront === "function") bringToFront(win);
}

// Spawn notification after ~1 min – 1m10s
setTimeout(spawnNotification, Math.floor(Math.random() * 10000) + 10);

