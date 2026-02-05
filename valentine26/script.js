const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const questionContainer = document.getElementById('question-container');
const buttonsContainer = document.querySelector('.buttons');
const successContainer = document.getElementById('success-gif-container');
const successGif = document.getElementById('success-gif');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let yesScale = 1;
const NO_BUTTON_MOVE_DISTANCE = 150;
const GIF_URL = "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExN2NsOWJtbzVndmFnZnQyc3Boc2M0ZXFnYWx2ejdtOXMyN3B6Y3BvbSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/8QbwUh40Hl96yMgvOx/giphy.gif";

// Resize canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// --- No Button Logic ---
function moveNoButton() {
    const container = document.getElementById('main-container');
    const containerRect = container.getBoundingClientRect();

    // Get button dimensions
    const btnRect = noBtn.getBoundingClientRect();

    // Calculate safe boundaries (avoiding going off screen)
    const maxX = window.innerWidth - btnRect.width - 20;
    const maxY = window.innerHeight - btnRect.height - 20;

    // Random position
    let newX = Math.random() * maxX;
    let newY = Math.random() * maxY;

    // Simple check to ensure it doesn't just stay in the same place
    noBtn.style.position = 'fixed';
    noBtn.style.left = `${newX}px`;
    noBtn.style.top = `${newY}px`;
}

// Move on mouse over (desktop)
noBtn.addEventListener('mouseover', moveNoButton);

// Move on click (mobile/fallback)
noBtn.addEventListener('click', (e) => {
    e.preventDefault();
    moveNoButton();
});

// --- Yes Button Logic ---
yesBtn.addEventListener('click', () => {
    // Hide question container and buttons
    questionContainer.classList.add('hidden');
    buttonsContainer.classList.add('hidden');

    // Show success
    successGif.src = GIF_URL;
    successContainer.classList.remove('hidden');

    // Start celebration
    startCelebration();
});

// Make "Yes" grow on each attempt at "No"
noBtn.addEventListener('mouseover', () => {
    yesScale += 0.15;
    yesBtn.style.transform = `scale(${yesScale})`;
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
