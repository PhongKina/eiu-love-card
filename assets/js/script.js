const canvas = document.getElementById('sparkleCanvas');
const ctx = canvas.getContext('2d');
let starParticles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function drawSparkleStar(ctx, cx, cy, spikes, outerRadius, innerRadius, color) {
    let rot = Math.PI / 2 * 3;
    let x = cx, y = cy;
    let step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;
        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
}

class StarParticle {
    constructor(isBurst = false, nearBouquet = false) {
        this.reset(isBurst, nearBouquet);
    }

    reset(isBurst = false, nearBouquet = false) {
        if (isBurst) {
            this.x = canvas.width / 2;
            this.y = canvas.height / 2;
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 7 + 2;
            this.speedX = Math.cos(angle) * speed;
            this.speedY = Math.sin(angle) * speed;
        } else if (nearBouquet) {
            const cx = canvas.width / 2;
            const cy = canvas.height / 2;
            const radius = 180 + Math.random() * 160;
            const angle = Math.random() * Math.PI * 2;
            this.x = cx + Math.cos(angle) * radius;
            this.y = cy + Math.sin(angle) * radius;
            this.speedX = (Math.random() - 0.5) * 0.28;
            this.speedY = (Math.random() - 0.5) * 0.28;
        } else {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.speedX = (Math.random() - 0.5) * 0.38;
            this.speedY = (Math.random() - 0.5) * 0.38;
        }

        this.size = Math.random() * 5 + 4;
        this.opacity = Math.random() * 0.8 + 0.15;
        this.fadeSpeed = Math.random() * 0.007 + 0.003;
        this.color = ['#ffffff', '#fff59d', '#ffeb3b', '#ffe082', '#ffd54f'][Math.floor(Math.random() * 5)];
        this.rotation = Math.random() * 360;
        this.rotSpeed = (Math.random() - 0.5) * 1.3;
        this.isBurst = isBurst;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotSpeed;

        if (this.isBurst) {
            this.opacity -= 0.02;
        } else {
            this.opacity -= this.fadeSpeed;
            if (this.opacity <= 0) {
                this.reset(false, Math.random() > 0.74);
                this.opacity = 0.05;
                this.fadeSpeed = -Math.abs(this.fadeSpeed);
            } else if (this.opacity >= 0.9) {
                this.fadeSpeed = Math.abs(this.fadeSpeed);
            }
        }
    }

    draw() {
        if (this.opacity <= 0) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, this.opacity);
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 9;
        drawSparkleStar(ctx, 0, 0, 4, this.size, this.size / 3.4, this.color);
        ctx.restore();
    }
}

function initParticles() {
    starParticles = [];
    for (let i = 0; i < 280; i++) starParticles.push(new StarParticle(false, false));
    for (let i = 0; i < 100; i++) starParticles.push(new StarParticle(false, true));
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    starParticles.forEach(p => { p.update(); p.draw(); });
    starParticles = starParticles.filter(p => p.opacity > 0);
    while (starParticles.length < 380) {
        starParticles.push(new StarParticle(false, Math.random() > 0.74));
    }
    requestAnimationFrame(animate);
}

initParticles();
animate();

function burstEffect() {
    for (let i = 0; i < 50; i++) starParticles.push(new StarParticle(true));
}

const bouquet = document.getElementById('bouquet');
const bouquetImage = bouquet.querySelector('.bouquet-img');
const photoSlots = document.querySelectorAll('.photo-slot');


let revealed = false;
function makeFlowerCrop(slot) {
    const sourceWidth = bouquetImage.naturalWidth;
    const sourceHeight = bouquetImage.naturalHeight;
    const cropX = (slot.offsetLeft / bouquet.clientWidth) * sourceWidth;
    const cropY = (slot.offsetTop / bouquet.clientHeight) * sourceHeight;
    const cropWidth = (slot.offsetWidth / bouquet.clientWidth) * sourceWidth;
    const cropHeight = (slot.offsetHeight / bouquet.clientHeight) * sourceHeight;
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const context = canvas.getContext('2d');
    context.beginPath();
    context.ellipse(256, 256, 256, 256, 0, 0, Math.PI * 2);
    context.clip();
    context.drawImage(bouquetImage, cropX, cropY, cropWidth, cropHeight, 0, 0, 512, 512);
    return canvas.toDataURL('image/png');
}
function makeBouquetFlowerOpening(slot) {
    const sourceWidth = bouquetImage.naturalWidth;
    const sourceHeight = bouquetImage.naturalHeight;
    const canvas = document.createElement('canvas');
    canvas.width = sourceWidth;
    canvas.height = sourceHeight;
    const cutout = canvas.getContext('2d');
    cutout.drawImage(bouquetImage, 0, 0, sourceWidth, sourceHeight);

    cutout.globalCompositeOperation = 'destination-out';
    const centerX = ((slot.offsetLeft + slot.offsetWidth / 2) / bouquet.clientWidth) * sourceWidth;
    const centerY = ((slot.offsetTop + slot.offsetHeight / 2) / bouquet.clientHeight) * sourceHeight;
    const radiusX = (slot.offsetWidth / bouquet.clientWidth) * sourceWidth / 2;
    const radiusY = (slot.offsetHeight / bouquet.clientHeight) * sourceHeight / 2;
    cutout.beginPath();
    cutout.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
    cutout.fill();
    return canvas.toDataURL('image/png');
}

photoSlots.forEach(slot => {
    const photo = slot.querySelector('img');
    const showPhoto = () => { photo.hidden = false; };
    photo.addEventListener('load', showPhoto);
    photo.addEventListener('error', () => { photo.hidden = true; });
    if (photo.getAttribute('src') && photo.complete && photo.naturalWidth > 0) showPhoto();
});

async function revealBouquet() {
    if (revealed) return;
    revealed = true;
    // Keep the original flowers visible until each replacement photo is ready.
    await Promise.all(Array.from(photoSlots, async slot => {
        const photo = slot.querySelector('img');
        if (!photo.getAttribute('src')) return;
        try {
            await photo.decode();
            photo.hidden = false;
        } catch {
            photo.hidden = true;
        }
    }));
    bouquetImage.alt = 'Bó hoa với năm khung ảnh kỷ niệm';
    bouquet.classList.add('revealed');
    for (const slot of photoSlots) {
        const photo = slot.querySelector('img');
        if (photo.hidden) continue;
        const sinkingFlower = document.createElement('img');
        sinkingFlower.className = 'flower-sink';
        sinkingFlower.src = makeFlowerCrop(slot);
        sinkingFlower.alt = '';
        sinkingFlower.setAttribute('aria-hidden', 'true');
        sinkingFlower.style.left = slot.offsetLeft + 'px';
        sinkingFlower.style.top = slot.offsetTop + 'px';
        sinkingFlower.style.width = slot.offsetWidth + 'px';
        sinkingFlower.style.height = slot.offsetHeight + 'px';
        bouquet.appendChild(sinkingFlower);
        try { await sinkingFlower.decode(); } catch { /* Continue with the photo if the temporary flower cannot load. */ }
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));

        bouquetImage.src = makeBouquetFlowerOpening(slot);
        try { await bouquetImage.decode(); } catch { /* Keep the bouquet visible if an opening cannot be made. */ }
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        if (sinkingFlower.isConnected) {
            sinkingFlower.classList.add('sink');
            await new Promise(resolve => setTimeout(resolve, 250));
            sinkingFlower.remove();
        }
        slot.classList.add('show');
        await new Promise(resolve => setTimeout(resolve, 300));
    }
    bouquet.setAttribute('aria-label', 'B� hoa da m?');
    burstEffect();
    flyButterfly();
    ribbonBurst();
    // Reveal the locked invitation only after the final photo has finished appearing.
    await new Promise(resolve => setTimeout(resolve, 350));
    cardInvitation.hidden = false;
}

bouquet.addEventListener('click', revealBouquet);
bouquet.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        revealBouquet();
    }
});
function flyButterfly() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    [
        { color: 'blue', target: '.slot-1', duration: 4300, delay: 150, side: -1 },
        { color: 'pink', target: '.slot-5', duration: 5100, delay: 650, side: 1 },
        { color: 'gold', target: '.slot-4', duration: 5800, delay: 1100, side: -1, perch: { x: 0.33, y: 0.52 } }
    ].forEach(config => {
        const target = bouquet.querySelector(config.target);
        if (!target.classList.contains('show')) return;
        const butterfly = document.createElement('div');
        butterfly.className = 'flying-butterfly butterfly-' + config.color;
        butterfly.setAttribute('aria-hidden', 'true');
        butterfly.innerHTML = '<span class="butterfly-wings">🦋</span>';
        document.body.appendChild(butterfly);
        let start;
        function fly(now) {
            if (start === undefined) start = now;
            const elapsed = now - start - config.delay;
            if (elapsed < 0) {
                requestAnimationFrame(fly);
                return;
            }
            const progress = Math.min(elapsed / config.duration, 1);
            const t = 1 - Math.pow(1 - progress, 2);
            const rect = target.getBoundingClientRect();
            const baseRect = bouquet.getBoundingClientRect();
            const size = butterfly.offsetWidth;
            const endX = config.perch
                ? baseRect.left + baseRect.width * config.perch.x - size / 2
                : (config.side < 0 ? rect.left - size - 3 : rect.right + 10);
            const endY = config.perch
                ? baseRect.top + baseRect.height * config.perch.y - size / 2
                : rect.top + rect.height * 0.45 - size / 2;
            const startX = config.side < 0 ? -70 : window.innerWidth + 70;
            const startY = window.innerHeight * 0.7;
            const x = startX + (endX - startX) * t;
            const y = startY + (endY - startY) * t
                - Math.sin(t * Math.PI) * window.innerHeight * 0.2
                + Math.sin(t * Math.PI * 3) * 18 * (1 - t);
            const angle = Math.sin(t * Math.PI * 2) * 15 * (1 - t);
            butterfly.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${angle}deg)`;
            butterfly.style.opacity = Math.min(progress * 8, 1);
            if (progress < 1) {
                requestAnimationFrame(fly);
            } else {
                // Attach to the bouquet so the butterfly follows its floating motion.
                const bouquetRect = bouquet.getBoundingClientRect();
                butterfly.classList.add('is-perched');
                butterfly.style.left = ((endX + size / 2 - bouquetRect.left) / bouquetRect.width * 100) + '%';
                butterfly.style.top = ((endY + size / 2 - bouquetRect.top) / bouquetRect.height * 100) + '%';
                butterfly.style.transform = 'translate(-50%, -50%) rotate(-12deg)';
                bouquet.appendChild(butterfly);
            }
        }
        requestAnimationFrame(fly);
    });
}
function fireworksAroundRibbons() {
    const colors = ['#ffe08a', '#fff6d5', '#edb0a6', '#f5c56d', '#ffd9ad'];

    function launchCycle() {
        const rect = bouquet.getBoundingClientRect();
        const points = [
            { x: rect.left + rect.width * 0.06, y: rect.top + rect.height * 0.68 },
            { x: rect.left + rect.width * 0.94, y: rect.top + rect.height * 0.68 },
            { x: rect.left + rect.width * 0.82, y: rect.top + rect.height * 0.1 },
            { x: rect.left + rect.width * 0.18, y: rect.top + rect.height * 0.1 }
        ];

        points.forEach((point, burstIndex) => {
            setTimeout(() => {
                const burst = document.createElement('span');
                burst.className = 'firework-burst';
                burst.setAttribute('aria-hidden', 'true');
                burst.style.left = `${point.x}px`;
                burst.style.top = `${point.y}px`;
                for (let i = 0; i < 40; i++) {
                    const spark = document.createElement('i');
                    spark.className = 'firework-spark';
                    spark.style.setProperty('--angle', `${i * (360 / 40) + burstIndex * 9}deg`);
                    spark.style.setProperty('--distance', `${-(88 + Math.random() * 48)}px`);
                    spark.style.setProperty('--spark-color', colors[(i + burstIndex) % colors.length]);
                    burst.appendChild(spark);
                }
                document.body.appendChild(burst);
                setTimeout(() => burst.remove(), 2050);
            }, burstIndex * 180);
        });
    }

    launchCycle();
    setInterval(launchCycle, 1250);
}
function ribbonBurst() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const namespace = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(namespace, 'svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.setAttribute('overflow', 'visible');
    svg.setAttribute('aria-hidden', 'true');
    svg.classList.add('ribbon-burst');

    const colors = ['#dfb85d', '#e6a8a3', '#f1d68e'];
    const originX = 50;
    const originY = 72;
    const endYs = [87, 97, 106];
    const bouquetRect = bouquet.getBoundingClientRect();
    const maxVisibleY = 100 + Math.max(0, window.innerHeight - bouquetRect.bottom) / bouquetRect.height * 100 - 1;

    [-1, 1].forEach(side => {
        const freeSpace = side < 0 ? bouquetRect.left : window.innerWidth - bouquetRect.right;
        const reach = Math.max(2, Math.min(35, freeSpace / bouquetRect.width * 100 - 1));
        for (let i = 0; i < 3; i++) {
            const endX = side < 0 ? -reach * (0.5 + i * 0.25) : 100 + reach * (0.5 + i * 0.25);
            const endY = Math.min(endYs[i], maxVisibleY);
            const middleX = originX + side * (23 + i * 4);
            const middleY = originY + 9 + i * 3;
            const d = `M ${originX} ${originY} C ${originX + side * 9} ${originY + 5 + i}, ${middleX + side * 8} ${middleY - 8}, ${middleX} ${middleY} C ${middleX - side * 8} ${middleY + 9}, ${endX - side * 18} ${endY - 8}, ${endX} ${endY}`;
            const group = document.createElementNS(namespace, 'g');
            group.classList.add('ribbon-group');

            const satin = document.createElementNS(namespace, 'path');
            satin.setAttribute('d', d);
            satin.setAttribute('fill', 'none');
            satin.setAttribute('stroke', colors[i]);
            satin.setAttribute('stroke-width', '1.45');
            satin.setAttribute('stroke-linecap', 'round');
            satin.classList.add('ribbon-strand');

            const shine = document.createElementNS(namespace, 'path');
            shine.setAttribute('d', d);
            shine.setAttribute('fill', 'none');
            shine.setAttribute('stroke', '#fff6df');
            shine.setAttribute('stroke-width', '0.28');
            shine.setAttribute('stroke-linecap', 'round');
            shine.classList.add('ribbon-strand', 'ribbon-highlight');

            group.append(satin, shine);
            group.style.setProperty('--ribbon-duration', `${1.7 + i * 0.25}s`);
            group.style.setProperty('--ribbon-delay', `${i * 130}ms`);
            svg.appendChild(group);
        }
    });

    bouquet.appendChild(svg);
    svg.querySelectorAll('.ribbon-strand').forEach(path => {
        const length = path.getTotalLength();
        path.style.strokeDasharray = `${length}`;
        path.style.setProperty('--ribbon-length', `${length}`);
        path.style.strokeDashoffset = `${length}`;
    });
    setTimeout(fireworksAroundRibbons, 2700);
}
const cardInvitation = document.getElementById('cardInvitation');
const loveDialog = document.getElementById('loveDialog');
const openLetter = document.getElementById('openLetter');
const loveLetter = document.getElementById('loveLetter');
const dateGate = document.getElementById('dateGate');
const meetingDate = document.getElementById('meetingDate');
const dateError = document.getElementById('dateError');

cardInvitation.addEventListener('click', () => {
    if (cardInvitation.disabled) return;
    cardInvitation.disabled = true;
    cardInvitation.classList.add('is-unlocking');

    const revealPasswordForm = () => {
        openLetter.hidden = true;
        loveLetter.hidden = true;
        dateGate.hidden = false;
        dateGate.reset();
        dateError.textContent = '';
        meetingDate.removeAttribute('aria-invalid');
        loveDialog.showModal();
        cardInvitation.classList.remove('is-unlocking');
        cardInvitation.disabled = false;
        meetingDate.focus();
    };

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        revealPasswordForm();
    } else {
        setTimeout(revealPasswordForm, 620);
    }
});
document.getElementById('closeCard').addEventListener('click', () => loveDialog.close());
loveDialog.addEventListener('click', event => {
    if (event.target === loveDialog) {
        const bounds = loveDialog.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right ||
            event.clientY < bounds.top || event.clientY > bounds.bottom) loveDialog.close();
    }
});
loveDialog.addEventListener('close', () => cardInvitation.focus());
meetingDate.addEventListener('input', () => {
    meetingDate.value = meetingDate.value.replace(/\D/g, '').slice(0, 4);
    dateError.textContent = '';
    meetingDate.removeAttribute('aria-invalid');
});
dateGate.addEventListener('submit', event => {
    event.preventDefault();
    if (meetingDate.value.trim() === '0705') {
        window.location.href = 'love.html';
    } else {
        dateError.textContent = 'Em không nhớ chứ gì 😢';
        meetingDate.setAttribute('aria-invalid', 'true');
        meetingDate.focus();
        meetingDate.select();
    }
});













































