const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const questionContainer = document.getElementById('question-container');
const buttonsContainer = document.querySelector('.buttons');
const successContainer = document.getElementById('success-gif-container');
const successGif = document.getElementById('success-gif');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let yesScale = 1;
let noClickCount = 0;

const NO_MESSAGES = [
    "Khum",
    "Câu trả lời của em thật sự là z sao?",
    "Em chắc chưa?",
    "Thật sự là chắc rùi sao?",
    "Đừng làm thế mò",
    "Anh bẩu là đừng làm thế mà!",
    "Anh khóc giờ em ...",
    "Hmu hmu sao ác quá z em",
    "Really?",
    "Em được anh tặng một cơ hội làm lại",
    "Em nghĩ lại đi",
    "Please ...",
    "Thôi em ấn Đồng ý đi!",
    "Đã bảo là ấn Đồng ý đi màaaa",
    "Đồng ý!",
    "Đồng ý điiiiii"
];

const SUCCESS_GIF_URL = "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExN2NsOWJtbzVndmFnZnQyc3Boc2M0ZXFnYWx2ejdtOXMyN3B6Y3BvbSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/8QbwUh40Hl96yMgvOx/giphy.gif";

// Resize canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// --- No Button Logic ---
noBtn.addEventListener('click', () => {
    noClickCount++;

    // Update No button text
    const messageIndex = Math.min(noClickCount, NO_MESSAGES.length - 1);
    noBtn.textContent = NO_MESSAGES[messageIndex];

    // Make Yes button grow
    yesScale += 0.2;
    yesBtn.style.transform = `scale(${yesScale})`;

    // Add some extra space around the growing button
    const padding = 20 * yesScale;
    buttonsContainer.style.gap = `${padding}px`;
});

// --- Yes Button Logic ---
yesBtn.addEventListener('click', () => {
    // Hide question container and buttons
    questionContainer.classList.add('hidden');
    buttonsContainer.classList.add('hidden');

    // Show success
    successGif.src = SUCCESS_GIF_URL;
    successContainer.classList.remove('hidden');

    // Start celebration
    startCelebration();
});

// --- Celebration Animation (Hearts) ---
const hearts = [];
class Heart {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 20;
        this.size = Math.random() * 15 + 10;
        this.speed = Math.random() * 3 + 2;
        this.opacity = 1;
        this.angle = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.1;
    }

    update() {
        this.y -= this.speed;
        this.x += Math.sin(this.y / 30) * 2;
        this.angle += this.rotationSpeed;

        if (this.y < -20) {
            this.reset();
        }
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.fillStyle = `rgba(255, 77, 109, ${this.opacity})`;

        // Draw heart shape
        ctx.beginPath();
        const d = this.size;
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-d/2, -d/2, -d, d/3, 0, d);
        ctx.bezierCurveTo(d, d/3, d/2, -d/2, 0, 0);
        ctx.fill();

        ctx.restore();
    }
}

function startCelebration() {
    for (let i = 0; i < 50; i++) {
        hearts.push(new Heart());
    }
    animate();
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hearts.forEach(heart => {
        heart.update();
        heart.draw();
    });
    requestAnimationFrame(animate);
}
