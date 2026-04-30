const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 350;
canvas.height = 550;

let balls = [];
let pegs = [];
let buckets = [
    { x: 0, w: 70, color: '#2ecc71', label: '100' },
    { x: 70, w: 70, color: '#e74c3c', label: '500' },
    { x: 140, w: 70, color: '#9b59b6', label: '1000' },
    { x: 210, w: 70, color: '#f1c40f', label: '500' },
    { x: 280, w: 70, color: '#3498db', label: '100' }
];
let score = 0;

// Création des plots (Pegs)
function initPegs() {
    pegs = [];
    for (let y = 0; y < 5; y++) {
        for (let x = 0; x < 7; x++) {
            pegs.push({
                x: 40 + x * 45 + (y % 2 * 22),
                y: 180 + y * 45,
                radius: 10,
                active: true
            });
        }
    }
}
initPegs();

canvas.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const tx = touch.clientX - rect.left;
    const ty = touch.clientY - rect.top;
    
    // Calcul de l'angle de tir vers le doigt
    const angle = Math.atan2(ty - 30, tx - canvas.width/2);
    
    if (balls.length < 3) { // Max 3 balles à l'écran
        balls.push({
            x: canvas.width / 2,
            y: 30,
            vx: Math.cos(angle) * 8,
            vy: Math.sin(angle) * 8,
            radius: 10
        });
    }
});

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Dessiner les seaux (Papa Pear Style)
    buckets.forEach(b => {
        ctx.fillStyle = b.color;
        ctx.fillRect(b.x, canvas.height - 40, b.w, 40);
        ctx.fillStyle = "white";
        ctx.font = "bold 12px Arial";
        ctx.fillText(b.label, b.x + 20, canvas.height - 15);
    });

    // 2. Dessiner les plots (ils disparaissent si touchés)
    pegs.forEach(p => {
        if (p.active) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI*2);
            ctx.fillStyle = "#e67e22";
            ctx.fill();
            ctx.strokeStyle = "white";
            ctx.stroke();
            ctx.closePath();
        }
    });

    // 3. Gérer les balles
    balls.forEach((b, index) => {
        b.vy += 0.2; // Gravité
        b.x += b.vx;
        b.y += b.vy;

        // Rebond murs
        if (b.x < 0 || b.x > canvas.width) b.vx *= -1;

        // Collision plots
        pegs.forEach(p => {
            if (p.active) {
                let dx = b.x - p.x;
                let dy = b.y - p.y;
                let dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < b.radius + p.radius) {
                    b.vy *= -0.7;
                    b.vx += dx * 0.1;
                    p.active = false; // Le plot disparaît !
                    score += 10;
                }
            }
        });

        // Tomber dans un seau
        if (b.y > canvas.height - 40) {
            balls.splice(index, 1);
            // On pourrait ajouter du score ici selon le seau
        }

        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI*2);
        ctx.fillStyle = "#f39c12"; // Balle dorée
        ctx.fill();
        ctx.closePath();
    });

    // Score
    ctx.fillStyle = "black";
    ctx.font = "bold 20px Arial";
    ctx.fillText("Score: " + score, 10, 30);

    requestAnimationFrame(draw);
}
draw();
