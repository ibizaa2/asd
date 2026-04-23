class World {
    constructor() {
        this.height = 256;
        this.height2 = 32 // Koriste korkeus
        this.time = 0; // 0-1, päivä sykli
        this.sun = { size: 50, color: "yellow" };
        this.moon = { size: 50, color: "cyan" };

        // Grafiikka
        this.ground = new Image();
        this.ground.src = "./Images/Sand.png";
        
        this.ground2 = new Image() // koriste maahan
        this.ground2.src = "./Images/Sand2.png"

        this.tileWidth = 256;

        this.distance = 800;

        this.obstacles = [];
    }

    runMeter(player){
    player.distance = Math.floor(player.coordinates.x / 100)
}

update(ctx, cameraX, player) {
    this.time += 0.00001;
    if (this.time > 1) this.time -= 1;

        this.obstacles.forEach(obstacle => {
            obstacle.update(player)
        });
    
   
   
}

draw(ctx, cameraX) {
        ctx.save();
        const t = Math.cos(this.time * Math.PI * 2) * 0.5 + 0.5;

        const sunHeight = Math.sin(this.time * Math.PI * 2 - Math.PI / 2);

        const threshold = 0.7;
        const x = Math.abs(sunHeight);

        let horizonGlow = 0;
        if (x < threshold) {
            const normalized = x / threshold;
            horizonGlow = Math.pow(1 - normalized, 2);
        }

        const dayTop = [135, 206, 235];
        const nightTop = [5, 5, 30];

        const dayBottom = [255, 220, 150];
        const nightBottom = [20, 20, 50];

        const sunsetColor = [255, 80, 0];

        const topR = Math.floor(nightTop[0] * (1-t) + dayTop[0] * t);
        const topG = Math.floor(nightTop[1] * (1-t) + dayTop[1] * t);
        const topB = Math.floor(nightTop[2] * (1-t) + dayTop[2] * t);

        let bottomR = nightBottom[0] * (1-t) + dayBottom[0] * t;
        let bottomG = nightBottom[1] * (1-t) + dayBottom[1] * t;
        let bottomB = nightBottom[2] * (1-t) + dayBottom[2] * t;

        bottomR += sunsetColor[0] * horizonGlow;
        bottomG += sunsetColor[1] * horizonGlow;
        bottomB += sunsetColor[2] * horizonGlow;

        bottomR = Math.min(255, Math.floor(bottomR));
        bottomG = Math.min(255, Math.floor(bottomG));
        bottomB = Math.min(255, Math.floor(bottomB));

       if (player.shroomTimer > 0) {
        let colorchange = player.shroomTimer * 5; 
        
      
        ctx.filter = `hue-rotate(${colorchange}deg) saturate(800%)`;
    }

        const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);

        gradient.addColorStop(0, `rgb(${topR},${topG},${topB})`);
        gradient.addColorStop(0.65, `rgb(${topR},${topG},${topB})`);
        gradient.addColorStop(0.85, `rgb(${bottomR},${bottomG},${bottomB})`);
        gradient.addColorStop(1, `rgb(${bottomR},${bottomG},${bottomB})`);

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);



        const centerX = ctx.canvas.width / 2;
        const centerY = ctx.canvas.height / 1.25;

        const sunX = centerX + this.distance * 1.25 * Math.cos(this.time * Math.PI * 2 - Math.PI / 2);
        const sunY = centerY + this.distance * Math.sin(this.time * Math.PI * 2 - Math.PI / 2);

        ctx.save();
        ctx.shadowBlur = 50;
        ctx.shadowColor = this.sun.color;
        ctx.beginPath();
        ctx.arc(sunX, sunY, this.sun.size, 0, Math.PI * 2);
        ctx.fillStyle = this.sun.color;
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.shadowBlur = 50;
        ctx.shadowColor = "white";
        ctx.beginPath();
        ctx.arc(sunX, sunY, this.sun.size * 0.9, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.restore();

        const moonX = centerX - this.distance * 1.25 * Math.cos(this.time * Math.PI * 2 - Math.PI / 2);
        const moonY = centerY - this.distance * Math.sin(this.time * Math.PI * 2 - Math.PI / 2);

        ctx.save();
        ctx.shadowBlur = 50;
        ctx.shadowColor = this.moon.color;
        ctx.beginPath();
        ctx.arc(moonX, moonY, this.moon.size, 0, Math.PI * 2);
        ctx.fillStyle = this.moon.color;
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.shadowBlur = 50;
        ctx.shadowColor = "white";
        ctx.beginPath();
        ctx.arc(moonX, moonY, this.moon.size * 0.9, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.restore();

        // Hiekka rakennus

        const tilesNeeded = Math.ceil(ctx.canvas.width / this.tileWidth) + 1;

        for (let i = 0; i < tilesNeeded; i++) {
            const x = i * this.tileWidth - cameraX % this.tileWidth;

            // Päämaa
            const groundY = ctx.canvas.height - this.height;
            ctx.drawImage(this.ground, x, groundY, this.tileWidth, this.height);

            // Koriste maan päällä
            const ground2Y = groundY - this.height2;
            ctx.drawImage(this.ground2, x, ground2Y, this.tileWidth, this.height2);
        }

        ctx.restore();

        ctx.save();

        let screenRightEdge = cameraX + ctx.canvas.width;

        this.obstacles.forEach(obstacle => {
    obstacle.draw(ctx, cameraX);
});

    ctx.restore();
       

    
        
        }
   
}
