const photoFiles = [
    "eiu1.jfif", "eiu2.jfif", "eiu3.jfif", "eiu4.jfif", "eiu5.jfif",
    "eiu6.jfif", "eiu7.jfif", "eiu8.jfif", "eiu9.jfif", "eiu10.jfif", "eiu11.jfif"
];
const wishes = [
    "Ch\u00fac em lu\u00f4n vui v\u1ebb, h\u1ea1nh ph\u00fac v\u00e0 r\u1ea1ng r\u1ee1 nh\u01b0 nh\u1eefng \u0111\u00f3a hoa",
    "Mong m\u1ecdi \u0111i\u1ec1u d\u1ecbu d\u00e0ng \u0111\u1ebfn v\u1edbi em",
    "C\u1ea3m \u01a1n em \u0111\u00e3 \u0111\u1ebfn v\u00e0 l\u00e0m nh\u1eefng ng\u00e0y b\u00ecnh th\u01b0\u1eddng th\u1eadt \u0111\u1eb7c bi\u1ec7t",
    "Mong n\u1ee5 c\u01b0\u1eddi lu\u00f4n \u1edf tr\u00ean m\u00f4i em",
    "Em x\u1ee9ng \u0111\u00e1ng v\u1edbi th\u1eadt nhi\u1ec1u h\u1ea1nh ph\u00fac",
    "M\u1ed7i kho\u1ea3nh kh\u1eafc b\u00ean em \u0111\u1ec1u th\u1eadt \u0111\u1eb9p",
    "Ch\u00fac c\u00f4 g\u00e1i c\u1ee7a anh ng\u00e0y n\u00e0o c\u0169ng vui",
    "Th\u01b0\u01a1ng em nhi\u1ec1u h\u01a1n nh\u1eefng v\u00ec sao"
];
const photoField = document.getElementById("photoField");
const memoryField = document.getElementById("memoryField");
const photoViewer = document.getElementById("photoViewer");
const viewerImage = document.getElementById("viewerImage");
const viewerWish = document.getElementById("viewerWish");
let lastSelectedPhoto = null;

const interactionHint = document.querySelector(".interaction-hint");
const touchLayout = window.matchMedia("(hover: none), (pointer: coarse)");
function updateInteractionHint() {
    interactionHint.textContent = touchLayout.matches
        ? "Chạm vào ảnh để xem lời chúc"
        : "Kéo ảnh bằng chuột để di chuyển · Bấm để xem lời chúc";
}
updateInteractionHint();
touchLayout.addEventListener?.("change", updateInteractionHint);

photoFiles.forEach((file, index) => {
    const frame = document.createElement("figure");
    frame.className = "memory-photo";
    frame.setAttribute("role", "button");
    frame.setAttribute("tabindex", "0");
    frame.setAttribute("aria-label", "Xem anh va loi chuc " + (index + 1));
    frame.style.setProperty("--delay", (0.25 + index * 0.22) + "s");
    const image = document.createElement("img");
    image.src = "assets/images/" + file;
    image.alt = "Ky niem " + (index + 1);
    image.loading = "eager";
    frame.appendChild(image);
    const heartDecoration = document.createElement("span");
    heartDecoration.className = "photo-hearts";
    heartDecoration.setAttribute("aria-hidden", "true");
    heartDecoration.innerHTML = '<span class="photo-heart photo-heart-one"><svg viewBox="0 0 24 24"><path d="M12 21s-8.5-5.2-9.8-10.2C1 6.7 3.2 3.5 6.7 3.5c2.2 0 4.1 1.3 5.3 3.1 1.2-1.8 3.1-3.1 5.3-3.1 3.5 0 5.7 3.2 4.5 7.3C20.5 15.8 12 21 12 21z"/></svg></span><span class="photo-heart photo-heart-two"><svg viewBox="0 0 24 24"><path d="M12 21s-8.5-5.2-9.8-10.2C1 6.7 3.2 3.5 6.7 3.5c2.2 0 4.1 1.3 5.3 3.1 1.2-1.8 3.1-3.1 5.3-3.1 3.5 0 5.7 3.2 4.5 7.3C20.5 15.8 12 21 12 21z"/></svg></span><span class="photo-heart photo-heart-three"><svg viewBox="0 0 24 24"><path d="M12 21s-8.5-5.2-9.8-10.2C1 6.7 3.2 3.5 6.7 3.5c2.2 0 4.1 1.3 5.3 3.1 1.2-1.8 3.1-3.1 5.3-3.1 3.5 0 5.7 3.2 4.5 7.3C20.5 15.8 12 21 12 21z"/></svg></span>';
    frame.appendChild(heartDecoration);
    const wishCaption = document.createElement("figcaption");
    wishCaption.className = "photo-wish";
    wishCaption.textContent = wishes[index % wishes.length];
    frame.appendChild(wishCaption);
    photoField.appendChild(frame);
    const showMemory = () => {
        lastSelectedPhoto = frame;
        viewerImage.src = image.src;
        viewerImage.alt = image.alt;
        viewerWish.textContent = wishes[index % wishes.length];
        photoViewer.showModal();
    };
    frame.addEventListener("pointerenter", () => {
        const bounds = frame.getBoundingClientRect();
        frame.classList.toggle("wish-above", bounds.bottom + 62 > window.innerHeight);
    });
    frame.addEventListener("click", () => {
        if (frame.dataset.dragged === "true") {
            frame.dataset.dragged = "false";
            return;
        }
        showMemory();
    });
    let dragState = null;
    frame.addEventListener("pointerdown", event => {
        if (event.button !== 0 || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
        const fieldBounds = photoField.getBoundingClientRect();
        const frameBounds = frame.getBoundingClientRect();
        dragState = {
            pointerId: event.pointerId,
            startX: event.clientX,
            startY: event.clientY,
            fieldBounds,
            offsetX: event.clientX - frameBounds.left,
            offsetY: event.clientY - frameBounds.top,
            moved: false
        };
        frame.classList.add("is-dragging");
        frame.style.left = (frameBounds.left - fieldBounds.left) + "px";
        frame.style.top = (frameBounds.top - fieldBounds.top) + "px";
        frame.style.right = "auto";
        frame.style.bottom = "auto";
        frame.setPointerCapture(event.pointerId);
        event.preventDefault();
    });
    frame.addEventListener("pointermove", event => {
        if (!dragState || event.pointerId !== dragState.pointerId) return;
        if (Math.abs(event.clientX - dragState.startX) + Math.abs(event.clientY - dragState.startY) > 3) dragState.moved = true;
        const left = Math.max(0, Math.min(dragState.fieldBounds.width - frame.offsetWidth, event.clientX - dragState.fieldBounds.left - dragState.offsetX));
        const top = Math.max(0, Math.min(dragState.fieldBounds.height - frame.offsetHeight, event.clientY - dragState.fieldBounds.top - dragState.offsetY));
        frame.style.left = left + "px";
        frame.style.top = top + "px";
    });
    const finishDrag = event => {
        if (!dragState || event.pointerId !== dragState.pointerId) return;
        frame.dataset.dragged = dragState.moved ? "true" : "false";
        if (dragState.moved) {
            frame.classList.add("is-placed");
            frame.animate([{ scale: "1" }, { scale: "1.09" }, { scale: "0.98" }, { scale: "1" }], { duration: 420, easing: "ease-out" });
        }
        if (frame.hasPointerCapture(event.pointerId)) frame.releasePointerCapture(event.pointerId);
        frame.classList.remove("is-dragging");
        dragState = null;
    };
    frame.addEventListener("pointerup", finishDrag);
    frame.addEventListener("pointercancel", finishDrag);
    frame.addEventListener("lostpointercapture", finishDrag);
    frame.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            showMemory();
        }
    });
});

const wishSky = document.createElement("div");
wishSky.className = "wish-sky";
wishSky.setAttribute("aria-hidden", "true");
wishes.forEach((wish, index) => {
    const wishStar = document.createElement("span");
    wishStar.className = "sky-wish";
    wishStar.textContent = wish;
    wishStar.style.setProperty("--wish-delay", (-index * 0.65) + "s");
    wishSky.appendChild(wishStar);
});
memoryField.appendChild(wishSky);

document.getElementById("viewerClose").addEventListener("click", () => photoViewer.close());
const letterPhoto = document.querySelector(".letter-photo");
const toggleLetterPhotoZoom = () => {
    const isZoomed = sunflowerLetter.classList.toggle("is-photo-zoomed");
    letterPhoto.setAttribute("aria-expanded", String(isZoomed));
};
letterPhoto.addEventListener("click", toggleLetterPhotoZoom);
letterPhoto.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleLetterPhotoZoom();
    }
});
photoViewer.addEventListener("click", event => {
    if (event.target === photoViewer) {
        const bounds = photoViewer.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) photoViewer.close();
    }
});
photoViewer.addEventListener("close", () => {
    if (lastSelectedPhoto) lastSelectedPhoto.focus();
});
const letterCopy = document.querySelector(".letter-copy");
let letterCharacterIndex = 0;
function prepareLetterTyping() {
    if (letterCopy.dataset.typingReady === "true") return;
    const walker = document.createTreeWalker(letterCopy, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    while (walker.nextNode()) {
        if (walker.currentNode.nodeValue.trim()) textNodes.push(walker.currentNode);
    }
    textNodes.forEach(textNode => {
        const fragment = document.createDocumentFragment();
        Array.from(textNode.nodeValue).forEach(character => {
            const letter = document.createElement("span");
            letter.className = "letter-char";
            letter.textContent = character;
            letter.style.animationDelay = (500 + letterCharacterIndex * 18) + "ms";
            letterCharacterIndex += 1;
            fragment.appendChild(letter);
        });
        textNode.parentNode.replaceChild(fragment, textNode);
    });
    letterCopy.dataset.typingReady = "true";
}const loveCardTrigger = document.getElementById("loveCardTrigger");
const sunflowerCardDialog = document.getElementById("sunflowerCardDialog");
const sunflowerCardClose = document.getElementById("sunflowerCardClose");
const sunflowerSeal = document.getElementById("sunflowerSeal");
const sunflowerLetter = document.getElementById("sunflowerLetter");
window.setTimeout(() => { loveCardTrigger.hidden = false; }, 5000);
loveCardTrigger.addEventListener("click", () => sunflowerCardDialog.showModal());
sunflowerSeal.addEventListener("click", () => {
    sunflowerCardDialog.classList.add("is-open");
    prepareLetterTyping();
    letterCopy.classList.add("is-typing");
    sunflowerLetter.hidden = false;
});
sunflowerCardClose.addEventListener("click", () => sunflowerCardDialog.close());
sunflowerCardDialog.addEventListener("click", event => {
    if (event.target === sunflowerCardDialog) {
        const bounds = sunflowerCardDialog.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) sunflowerCardDialog.close();
    }
});
sunflowerCardDialog.addEventListener("close", () => {
    sunflowerCardDialog.classList.remove("is-open");
    sunflowerLetter.classList.remove("is-photo-zoomed");
    letterCopy.classList.remove("is-typing");
    letterPhoto.setAttribute("aria-expanded", "false");
    sunflowerLetter.hidden = true;
    loveCardTrigger.focus();
});
const canvas = document.getElementById("starCanvas");
const context = canvas.getContext("2d");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
const starFrameInterval = coarsePointer ? 1000 / 30 : 0;
let nextStarFrameAt = 0;
let stars = [];
let meteors = [];
let width = window.innerWidth;
let height = window.innerHeight;
let cameraX = 0;
let cameraY = 0;
let targetCameraX = 0;
let targetCameraY = 0;
let nextMeteorAt = 0;
let previousFrame = 0;

function resizeStars() {
    const ratio = Math.min(window.devicePixelRatio || 1, coarsePointer ? 1.35 : 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    context.setTransform(ratio, 0, 0, ratio, 0, 0);

    const count = Math.min(coarsePointer ? 210 : 900, Math.floor(width * height / (coarsePointer ? 1500 : 1700)));
    stars = Array.from({ length: count }, () => {
        const depth = 0.34 + Math.random() * 0.76;
        return {
            x: (Math.random() * width - width / 2) * depth,
            y: (Math.random() * height - height / 2) * depth,
            depth,
            radius: Math.random() * 1.35 + 0.45,
            phase: Math.random() * Math.PI * 2,
            twinkle: Math.random() * 0.045 + 0.012,
            speed: Math.random() * 0.0022 + 0.00075
        };
    });
}

function spawnMeteor() {
    const angle = Math.PI / 5 + Math.random() * 0.35;
    const speed = 7 + Math.random() * 5;
    meteors.push({
        x: Math.random() * (width + 120) - 60,
        y: -30 - Math.random() * height * 0.35,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        length: 12 + Math.random() * 13,
        life: 1,
        color: Math.random() > 0.5 ? "255, 224, 170" : "255, 190, 220"
    });
}

function drawMeteors(step) {
    const now = performance.now();
    if (!reduceMotion && now >= nextMeteorAt && meteors.length < 2) {
        spawnMeteor();
        nextMeteorAt = now + 1100 + Math.random() * 1800;
    }

    meteors = meteors.filter(meteor => meteor.life > 0 && meteor.x < width + 220 && meteor.y < height + 220);
    meteors.forEach(meteor => {
        meteor.x += meteor.vx * step;
        meteor.y += meteor.vy * step;
        meteor.life -= 0.008 * step;
        const tailX = meteor.x - meteor.vx * meteor.length;
        const tailY = meteor.y - meteor.vy * meteor.length;
        const trail = context.createLinearGradient(meteor.x, meteor.y, tailX, tailY);
        trail.addColorStop(0, "rgba(" + meteor.color + ", " + Math.min(1, meteor.life + 0.15) + ")");
        trail.addColorStop(1, "rgba(" + meteor.color + ", 0)");
        context.beginPath();
        context.moveTo(meteor.x, meteor.y);
        context.lineTo(tailX, tailY);
        context.strokeStyle = trail;
        context.lineWidth = 1.6;
        context.lineCap = "round";
        context.shadowBlur = 14;
        context.shadowColor = "rgba(" + meteor.color + ", .9)";
        context.stroke();
        context.beginPath();
        context.arc(meteor.x, meteor.y, 1.8, 0, Math.PI * 2);
        context.fillStyle = "rgba(255, 250, 234, " + meteor.life + ")";
        context.fill();
    });
    context.shadowBlur = 0;
}

function drawStars(timestamp = 0) {
    if (starFrameInterval && timestamp < nextStarFrameAt) {
        requestAnimationFrame(drawStars);
        return;
    }
    nextStarFrameAt = timestamp + starFrameInterval;
    const step = previousFrame ? Math.min(2.5, (timestamp - previousFrame) / 16.67) : 1;
    previousFrame = timestamp;
    context.clearRect(0, 0, width, height);
    cameraX += (targetCameraX - cameraX) * 0.035;
    cameraY += (targetCameraY - cameraY) * 0.035;
    const focalLength = Math.min(width, height) * 0.58;

    stars.forEach(star => {
        if (!reduceMotion) star.depth -= star.speed * step;
        if (star.depth < 0.2) {
            star.depth = 1.1;
            star.x = (Math.random() * width - width / 2) * star.depth;
            star.y = (Math.random() * height - height / 2) * star.depth;
        }
        star.phase += star.twinkle * step;
        const depthScale = 1 / star.depth;
        const x = width / 2 + star.x * depthScale + cameraX * (1 - star.depth);
        const y = height / 2 + star.y * depthScale + cameraY * (1 - star.depth);
        if (x < -10 || x > width + 10 || y < -10 || y > height + 10) return;

        const radius = Math.min(3.5, star.radius * (1.35 - star.depth * 0.3));
        const alpha = 0.3 + (Math.sin(star.phase) + 1) * 0.3;
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fillStyle = "rgba(255, 239, 204, " + alpha + ")";
        if (star.depth < 0.62) {
            context.shadowBlur = coarsePointer ? 3 : 9;
            context.shadowColor = "#ffdf9a";
        }
        context.fill();
        context.shadowBlur = 0;
    });

    drawMeteors(step);
    requestAnimationFrame(drawStars);
}

window.addEventListener("resize", resizeStars);
window.addEventListener("pointermove", event => {
    if (event.pointerType === "touch") return;
    targetCameraX = (event.clientX / width - 0.5) * 36;
    targetCameraY = (event.clientY / height - 0.5) * 26;

    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        document.querySelectorAll(".memory-photo:not(.is-dragging)").forEach(photo => {
            const bounds = photo.getBoundingClientRect();
            const x = (event.clientX - (bounds.left + bounds.width / 2)) / Math.max(bounds.width, 1);
            const y = (event.clientY - (bounds.top + bounds.height / 2)) / Math.max(bounds.height, 1);
            photo.style.setProperty("--tilt-x", Math.max(-4, Math.min(4, x * 3)) + "deg");
            photo.style.setProperty("--tilt-y", Math.max(-4, Math.min(4, y * -3)) + "deg");
        });
    }
});
window.addEventListener("pointerleave", () => {
    targetCameraX = 0;
    targetCameraY = 0;
    document.querySelectorAll(".memory-photo").forEach(photo => {
        photo.style.setProperty("--tilt-x", "0deg");
        photo.style.setProperty("--tilt-y", "0deg");
    });
});
resizeStars();
nextMeteorAt = performance.now() + 650;
drawStars();


