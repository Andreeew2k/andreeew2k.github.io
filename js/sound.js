function playSound(src, volume = 0.5) {
  const audio = new Audio(src);
  audio.volume = volume;
  audio.play().catch(err => console.warn("Audio blocked:", err));
}

// Pre-defined shortcuts
window.SoundFX = {
  click: () => playSound("sounds/click.mp3"),
  error: () => playSound("sounds/error.mp3")
};
