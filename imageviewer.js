// music.js
document.addEventListener("DOMContentLoaded", () => {
  const tpl = document.getElementById("music-template");
  const musicIcon = document.getElementById("music-icon");

  if (!tpl) {
    console.error("Music template not found");
    return;
  }
  if (!musicIcon) {
    console.error("Music icon not found");
    return;
  }

  function openMusicPlayer() {
    const win = tpl.content.firstElementChild.cloneNode(true);
    document.body.appendChild(win);
    if (window.bringToFront) window.bringToFront(win);

    const canvas = win.querySelector("#music-visualizer");
    const ctx = canvas.getContext("2d");
    const playBtn = win.querySelector("#play-btn");

    // Audio
    const audio = new Audio("music/song.mp3"); // 🎵 put your song file here
    audio.loop = true;
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const src = audioCtx.createMediaElementSource(audio);
    const analyser = audioCtx.createAnalyser();
    src.connect(analyser);
    analyser.connect(audioCtx.destination);
    analyser.fftSize = 256;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    function draw() {
      requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i] / 2;
        ctx.fillStyle = "lime";
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }
    }
    draw();

    playBtn.addEventListener("click", () => {
      if (audioCtx.state === "suspended") audioCtx.resume();
      if (audio.paused) audio.play();
      else audio.pause();
    });

    win.querySelector(".close-btn").addEventListener("click", () => {
      audio.pause();
      win.remove();
    });
  }

  // Helper: detect mobile
  function isMobile() {
    return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  }

  const imagesIcon = document.getElementById("images-icon");
  if (isMobile()) {
    imagesIcon.addEventListener("click", handler);
  } else {
    imagesIcon.addEventListener("dblclick", handler);

    // 👇 Auto-open ONLY on desktop
    fetch("images.json")
      .then(res => res.json())
      .then(data => {
        const shuffled = data.sort(() => Math.random() - 0.5);
        openImageViewer(shuffled);
      });
  }
  });
