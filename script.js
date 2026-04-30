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

    // 1. Dessiner les seaux avec des yeux (Papa Pear Style)
    buckets.forEach(b => {
        // Le corps du seau
        ctx.fillStyle = b.color;
        ctx.beginPath();
        ctx.roundRect(b.x + 5, canvas.height - 60, b.w - 10, 50, 10);
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Les Yeux
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(b.x + 25, canvas.height - 45, 5, 0, Math.PI*2);
        ctx.arc(b.x + 45, canvas.height - 45, 5, 0, Math.PI*2);
        ctx.fill();
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(b.x + 25, canvas.height - 45, 2, 0, Math.PI*2);
        ctx.arc(b.x + 45, canvas.height - 45, 2, 0, Math.PI*2);
        ctx.fill();
        
        // Le score au dessus
        ctx.fillStyle = "white";
        ctx.font = "bold 10px Arial";
        ctx.fillText(b.label, b.x + 22, canvas.height - 10);
    });

    // 2. Dessiner les obstacles (Pegs)
    pegs.forEach(p => {
        if (p.active) {
            // Dessin d'un plot orange avec un contour
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI*2);
            ctx.fillStyle = "#e67e22"; // Orange
            ctx.fill();
            ctx.strokeStyle = "#d35400";
            ctx.stroke();
            // Petit reflet blanc sur le plot
            ctx.beginPath();
            ctx.arc(p.x - 3, p.y - 3, 2, 0, Math.PI*2);
            ctx.fillStyle = "rgba(255,255,255,0.5)";
            ctx.fill();
        }
    });

    // 3. Gérer les billes et les rebonds (Garde le reste de ton code ici...)
    balls.forEach((b, index) => {
        // ... (ton code de mouvement actuel) ...
        
        // Dessin de la bille (Papa Pear est une poire, ici on fait une bille dorée)
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI*2);
        ctx.fillStyle = "#f1c40f";
        ctx.fill();
        ctx.stroke();
    });

    requestAnimationFrame(draw);
}
draw();
