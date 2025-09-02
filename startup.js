// // startup.js
// window.addEventListener("load", () => {
//   const startup = document.getElementById("startup");
//   const sound = document.getElementById("startup-sound");

//   // Wait for the first user click/tap
//   function enableStartupSound() {
//     if (sound) {
//       sound.play().catch(err => console.warn("Startup sound blocked:", err));
//     }

//     if (startup) {
//       setTimeout(() => {
//         startup.classList.add("fade-out");
//         setTimeout(() => startup.remove(), 1000);
//       }, 4000);
//     }

//     // Only run once
//     window.removeEventListener("click", enableStartupSound);
//     window.removeEventListener("keydown", enableStartupSound);
//   }

//   window.addEventListener("click", enableStartupSound, { once: true });
//   window.addEventListener("keydown", enableStartupSound, { once: true });
// });
