window.addEventListener("load", () => {
  const startup = document.getElementById("startup");
  const sound = document.getElementById("startup-sound");

  if (sound) sound.play().catch(()=>{});

  if (startup) {
    setTimeout(() => {
      startup.classList.add("fade-out");
      setTimeout(() => startup.remove(), 1000);
    }, 4000);
  }
});
