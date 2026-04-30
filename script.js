const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 350;
canvas.height = 550;

let balls = [];
let items = []; // Glands, piments, et pièces
let score = 0;
let goldPieces = 0;

// Configuration des 5 barils en bas
const buckets = [
    { x: 0, w: 70, color: '#2ecc71', points: 100 },
    { x: 70, w: 70, color: '#e74c3c', points: 500 },
    { x: 140, w: 70, color: '#9b59b6', points: 1000 },
    { x: 210, w: 70, color: '#f1c40f', points: 500 },
    { x: 280, w: 70, color: '#3498db', points: 100 }
];

// Initialisation des objets en l'air (Glands et Pièces d'or)
function initLevel() {
    items = [];
    for (let i = 0; i < 30; i++) {
        items.push({
            x: Math.random() * (canvas.width - 40) + 20,
            y: Math.random() * 300 + 100,
            type: Math.random() > 0.2 ? 'gland' : 'gold',
            active: true,
            radius: 10
        });
    }
}
initLevel();

// Tirer une "Boull" vers le doigt
canvas.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const tx = touch.clientX - rect.left;
    const ty = touch.clientY - rect.top;
    
    const angle = Math.atan2(ty - 30, tx - canvas.width/2);
    
    if (balls.length < 1) { // Une bille à la fois pour la réflexion
        balls.push({ x: canvas.width/2, y: 30, vx: Math.cos(angle)*7, vy: Math.sin(angle)*7, radius: 12 });
    }
});

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dessiner les 5 barils
    buckets.forEach(b => {
        ctx.fillStyle = b.color;
        ctx.fillRect(b.x + 2, canvas.height - 50, b.w - 4, 50);
        ctx.fillStyle = "white";
        ctx.fillText(b.points, b.x + 20, canvas.height - 20);
    });

    // Dessiner les objets (Rebonds et Pièces)
    items.forEach(item => {
        if (item.active) {
            ctx.beginPath();
            ctx.arc(item.x, item.y, item.radius, 0, Math.PI*2);
            ctx.fillStyle = item.type === 'gold' ? '#f1c40f' : '#d35400';
            ctx.fill();
            ctx.stroke();
        }
    });

    // Mouvement de la balle
    balls.forEach((b, index) => {
        b.vy += 0.15; // Gravité
        b.x += b.vx;
        b.y += b.vy;

        // Rebond murs
        if (b.x < 0 || b.x > canvas.width) b.vx *= -1;

        // Collision avec objets
        items.forEach(item => {
            if (item.active) {
                let dx = b.x - item.x;
                let dy = b.y - item.y;
                let dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < b.radius + item.radius) {
                    b.vy *= -0.7; // Rebond
                    b.vx += dx * 0.1;
                    if (item.type === 'gold') goldPieces++;
                    else score += 50;
                    item.active = false;
                }
            }
        });

        // Entrée dans un baril
        if (b.y > canvas.height - 50) {
            buckets.forEach(bucket => {
                if (b.x > bucket.x && b.x < bucket.x + bucket.w) {
                    score += bucket.points;
                }
            });
            balls.splice(index, 1);
            if (items.filter(i => i.active).length === 0) initLevel(); // Recharger le niveau
        }

        // Dessin de la Boull
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI*2);
        ctx.fillStyle = "#ff7979";
        ctx.fill();
        ctx.stroke();
    });

    // Interface
    ctx.fillStyle = "black";
    ctx.font = "bold 16px Arial";
    ctx.fillText("Score: " + score, 10, 25);
    ctx.fillText("Or: " + goldPieces, 280, 25);

    requestAnimationFrame(draw);
}
draw();
