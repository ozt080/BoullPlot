const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Ajustement pour mobile
canvas.width = 350;
canvas.height = 500;

let balls = [];
let pegs = [];

// Créer les obstacles (les plots oranges de image_001fa0.png)
for (let y = 0; y < 5; y++) {
    for (let x = 0; x < 6; x++) {
        pegs.push({
            x: 50 + x * 50 + (y % 2 * 25),
            y: 150 + y * 50,
            radius: 8
        });
    }
}

// Tirer au toucher (iPhone)
canvas.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const touchX = touch.clientX - rect.left;
    
    balls.push({
        x: canvas.width / 2,
        y: 20,
        vx: (touchX - canvas.width / 2) * 0.05,
        vy: 3,
        radius: 7
    });
});

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dessiner les plots oranges
    pegs.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI*2);
        ctx.fillStyle = "#e67e22";
        ctx.fill();
        ctx.closePath();
    });

    // Dessiner les balles
    balls.forEach((b, index) => {
        b.vy += 0.15; // Gravité
        b.x += b.vx;
        b.y += b.vy;

        // Rebond sur les plots
        pegs.forEach(p => {
            let dx = b.x - p.x;
            let dy = b.y - p.y;
            let dist = Math.sqrt(dx*dx + dy*dy);
            if(dist < b.radius + p.radius) {
                b.vy *= -0.5;
                b.vx += dx * 0.1;
            }
        });

        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI*2);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.closePath();
    });
    requestAnimationFrame(draw);
}
draw();
