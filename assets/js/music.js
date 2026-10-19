const backgroundMusic = document.getElementById("backgroundMusic");
const musicToggle = document.getElementById("musicToggle");
const musicLabel = document.getElementById("musicLabel");

if (backgroundMusic && musicToggle && musicLabel) {
    backgroundMusic.volume = 0.55;
    backgroundMusic.loop = true;
    let userPaused = false;
    let soundEnabled = false;

    const updateMusicButton = () => {
        const isPlaying = !backgroundMusic.paused && !backgroundMusic.ended;
        musicToggle.classList.toggle("is-playing", isPlaying);

        if (isPlaying && !soundEnabled) {
            musicLabel.textContent = "Bật tiếng";
            musicToggle.setAttribute("aria-label", "Bật tiếng nhạc nền");
        } else {
            musicLabel.textContent = isPlaying ? "Tắt nhạc" : "Bật nhạc";
            musicToggle.setAttribute("aria-label", isPlaying ? "Tắt nhạc nền" : "Bật nhạc nền");
        }
    };

    const enableSound = event => {
        if (event && event.target instanceof Element && event.target.closest("#musicToggle")) return;
        soundEnabled = true;
        backgroundMusic.muted = false;
        if (backgroundMusic.paused && !userPaused) {
            backgroundMusic.play().catch(updateMusicButton);
        }
        updateMusicButton();
    };

    backgroundMusic.addEventListener("play", updateMusicButton);
    backgroundMusic.addEventListener("pause", updateMusicButton);
    backgroundMusic.addEventListener("ended", () => {
        if (!userPaused) backgroundMusic.play().catch(updateMusicButton);
    });
    backgroundMusic.addEventListener("error", () => {
        musicLabel.textContent = "Không tải được MP3";
        musicToggle.setAttribute("aria-label", "Không tải được nhạc nền");
    });

    musicToggle.addEventListener("click", () => {
        if (!soundEnabled) {
            soundEnabled = true;
            userPaused = false;
            backgroundMusic.muted = false;
            if (backgroundMusic.paused) backgroundMusic.play().catch(updateMusicButton);
            updateMusicButton();
        } else if (backgroundMusic.paused) {
            userPaused = false;
            backgroundMusic.play().catch(updateMusicButton);
        } else {
            userPaused = true;
            backgroundMusic.pause();
        }
    });

    backgroundMusic.play().catch(updateMusicButton);
    backgroundMusic.addEventListener("canplay", updateMusicButton, { once: true });
    window.addEventListener("pageshow", () => {
        if (!userPaused && backgroundMusic.paused) backgroundMusic.play().catch(updateMusicButton);
    });
    window.addEventListener("pointerdown", enableSound, { once: true });
    window.addEventListener("keydown", enableSound, { once: true });
}