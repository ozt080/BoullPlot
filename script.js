const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 350;
canvas.height = 550;

let balls = [];
let items = [];
let score = 0;
let papaFiestaActive = false;

// Configuration des barils (ils peuvent maintenant "s'allumer")
const buckets = [
    { x: 0, w: 70, color: '#555', activeColor: '#2ecc71', points: 100, lit: false },
    { x: 70, w: 70, color: '#555', activeColor: '#e74c3c', points: 500, lit: false },
    { x: 140, w: 70, color: '#555', activeColor: '#9b59b6', points: 1000, lit: false },
    { x: 210, w: 70, color: '#555', activeColor: '#f1c40f', points: 500, lit: false },
    { x: 280, w: 70, color: '#555', activeColor: '#3498db', points: 100, lit: false }
];

function initLevel() {
    items = [];
    for (let i = 0; i < 25; i++) {
        items.push({
            x: Math.random() * (canvas.width - 40) + 20,
            y: Math.random() * 300 + 120,
            type: Math.random() > 0.1 ? 'normal' : 'fire', // Le NIP de feu !
            active: true,
            radius: 10
        });
    }
}
initLevel();

canvas.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const tx = touch.clientX - rect.left;
    const ty = touch.clientY - rect.top;
    const angle = Math.atan2(ty - 30, tx - canvas.width/2);
    
    if (balls.length < 1) {
        balls.push({ 
            x: canvas.width/2, y: 30, 
            vx: Math.cos(angle)*8, vy: Math.sin(angle)*8, 
            radius: 12, mode: 'normal' 
        });
    }
});

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dessiner les barils (ils s'allument quand on tombe dedans)
    buckets.forEach(b => {
        ctx.fillStyle = b.lit ? b.activeColor : b.color;
        ctx.fillRect(b.x + 2, canvas.height - 50, b.w - 4, 50);
        ctx.fillStyle = "white";
        ctx.fillText(b.points, b.x + 25, canvas.height - 20);
    });

    // Dessiner les objets
    items.forEach(item => {
        if (item.active) {
            ctx.beginPath();
            ctx.arc(item.x, item.y, item.radius, 0, Math.PI*2);
            ctx.fillStyle = item.type === 'fire' ? '#ff4757' : '#e67e22';
            ctx.fill();
            ctx.stroke();
        }
    });

    balls.forEach((b, index) => {
        b.vy += 0.18; 
        b.x += b.vx;
        b.y += b.vy;

        // RÈGLE : Rebond sur le plafond pour points bonus
        if (b.y < 0) {
            b.vy *= -1;
            score += 100; // Bonus plafond !
        }

        if (b.x < 0 || b.x > canvas.width) b.vx *= -1;

        items.forEach(item => {
            if (item.active) {
                let dx = b.x - item.x;
                let dy = b.y - item.y;
                let dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < b.radius + item.radius) {
                    b.vy *= -0.7;
                    if (item.type === 'fire') b.mode = 'fire'; // Devient une boule de feu
                    item.active = false;
                    score += (b.mode === 'fire' ? 100 : 50);
                }
            }
        });

        // Entrée dans un baril
        if (b.y > canvas.height - 50) {
            buckets.forEach(bucket => {
                if (b.x > bucket.x && b.x < bucket.x + bucket.w) {
                    bucket.lit = true; // Allume le seau
                    score += bucket.points;
                }
            });
            balls.splice(index, 1);
            
            // Vérifier si tous les barils sont allumés -> PAPA FIESTA !
            if (buckets.every(baril => baril.lit)) {
                papaFiestaActive = true;
            }
        }

        // Dessin de la boule (normale ou feu)
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI*2);
        ctx.fillStyle = b.mode === 'fire' ? '#ff1f1f' : '#ff7979';
        ctx.fill();
        ctx.closePath();
    });

    if (papaFiestaActive) {
        ctx.fillStyle = "#f1c40f";
        ctx.font = "bold 40px Arial";
        ctx.fillText("PAPA FIESTA !", 40, canvas.height/2);
    }

    ctx.fillStyle = "black";
    ctx.font = "bold 16px Arial";
    ctx.fillText("Score: " + score, 10, 25);
    requestAnimationFrame(draw);
}
draw();
