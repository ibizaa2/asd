class Ammo {
    constructor(direction, owner, startX, startY, type = "bullet") {
        //id jokaiselle ammukselle debuggausta varten
        this.id = Math.random()
        this.direction = direction;
        this.owner = owner;
        this.startX = startX;
        this.startY = startY;
        this.type = type;
        this.range = owner.range;
        this.isActive = true;
        this.life = 1;
        this.size = type === "chomp" ? 4 : 1;
        this.color = type === "chomp" ? "rgba(255, 0, 0, 1)" : "yellow";
        this.radius = type === "chomp" ? (owner.head1?.firepoint || owner.range * 0.25) : 0;
        this.damage = 0; // Asetetaan myöhemmin
        this.pierce = owner.pierce
        this.shotTargets = []

        // Asetetaan width ja height collision varten
        if (this.type === "bullet") {
            this.width = 2;
            this.height = 2;
        } else if (this.type === "chomp") {
            this.radius = this.owner.size * this.owner.head1.scale * (50 + this.owner.strenght);
            this.width = this.radius * 2;
            this.height = this.radius * 2;
        } else if (this.type === "projectile") {
            this.width = 10; // Oletus projectile koko
            this.height = 10;
        } else if (this.type === "Blast") {
            this.radius = 10;
            this.maxRadius = 150;
            this.growth = 8; // kuinka nopeasti kasvaa
            this.width = this.radius * 2;
            this.height = this.radius * 2;
            
            this.explosion = new Image()
            this.explosion.src = "Images/Explosion.png"
        }

        if (this.type === "projectile") {

        let speed = 20; 
            this.vx = Math.cos(this.direction) * speed;
            this.vy = Math.sin(this.direction) * speed;
            // Projectile koko asetetaan myöhemmin ownerissa
        }
    }

    update() {
        if (this.life <= 0) {
            this.isActive = false;
            return;
        }
        if (this.type === "bullet") {
            this.life -= 1;
        }
        if (this.type === "chomp") {
            this.life -= 1
        }
        if (this.type === "projectile") {
            this.startX += this.vx;
            this.startY += this.vy;
            
            // Lisätään painovoima
            this.vy += 0.5;
            
        }
        if (this.type === "Blast") {
            this.life -= 0.5;
        }
    }

    drawBullet(ctx, cameraX = 0) {
        if (this.type === "chomp") {
            this.drawChomp(ctx, cameraX);
            return;
        }
        if (this.type === "Blast") {
            this.drawBlast(ctx, cameraX, this.explosion)
            return
        }
        if (!this.isActive) return;

        const startX = this.startX - cameraX;
        const startY = this.startY;
        const endX = startX + Math.cos(this.direction) * this.range;
        const endY = startY + Math.sin(this.direction) * this.range;

        ctx.save();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.size;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        ctx.restore();
    }
    drawChomp(ctx, cameraX = 0) {
        // pika AOE
        if (!this.isActive) return;
        this.color = "rgb(255, 255, 255)";
        this.radius = this.owner.size * this.owner.head1.scale * (50 + this.owner.strenght);
        
        this.width = this.radius * 2;
        this.height = this.radius * 2;
        
        ctx.save();
        ctx.globalAlpha = 0.3
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.startX - cameraX, this.startY, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
    drawProjectile(ctx, cameraX, image, width, height) {
    if (!this.isActive) return;
    
    if (image) {
        ctx.drawImage(image, this.startX - cameraX, this.startY, width, height);
    }
    
    }
    drawBlast(ctx, cameraX, image) {
        if (!this.isActive) return;

        this.radius = (this.owner.slamPower + this.owner.strenght / 4) * this.owner.size * 90

        const x = this.startX - cameraX;
        const y = this.startY;

        ctx.save();

        ctx.globalAlpha = this.life;

        if (image) {
            ctx.drawImage(
                image,
                x - this.radius,
                y - this.radius * this.owner.size * 1.25,
                this.radius * 2,
                this.radius * 2
            );
        }

        ctx.restore();
    }
}
