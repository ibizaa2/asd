const images = {
    flesh: new Image(),
    cactusFlesh: new Image()

    
}

images.flesh.src = "./Images/Flesh.png"
images.cactusFlesh.src = "./Images/Cactus.flesh.png"


class Drops {
    constructor(x, y, item) {
        this.coordinates = { x: x, y: y }
        this.velocity = { x: Math.random(0) * 30, y: - Math.random(50) * 70 }
        this.hitbox = { x: 0, y: 0, w: 100, h: 100 }

        this.gravity = 3

        this.angle = Math.random() * Math.PI * 2;
        this.angularVelocity = Math.random() * 10

    
        this.item = item

        this.img = new Image() 

        if (item === "flesh") {
            this.img = images.flesh
        } else if (item === "Cactusflesh") {
            this.img = images.cactusFlesh
            this.hitbox = { x: 0, y: 0, w: 150, h: 150 }
        }

  
            this.width = this.img.width;
            this.height = this.img.height;
            this.point = { x: this.width / 2, y: this.height / 2}
        

        this.scale = 0.5
        this.eaten = false
    }

    update(player, world, canvas) {
        if (this.eaten) return;

        // Magneetti
        if (player.blackhole) {
            const dx = player.blackholeCenter.x - this.coordinates.x - this.point.x * this.scale;
            const dy = player.blackholeCenter.y - this.coordinates.y - this.point.y * this.scale;

            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist > 1) {
                const speed = 25;

                this.velocity.x = (dx / dist) * speed;
                this.velocity.y = (dy / dist) * speed;
            }
        }

        // pyörintä
        this.angularVelocity = this.velocity.x * 0.01;
        this.angle += this.angularVelocity;

        // gravity
        if (!player.blackhole) {
            this.velocity.y += this.gravity;
        }

        // liike
        this.coordinates.x += this.velocity.x;
        this.coordinates.y += this.velocity.y;

        // Ground
        const groundLevel = canvas.height - world.height;

        if (this.coordinates.y + this.height * this.scale >= groundLevel) {
            this.coordinates.y = groundLevel - this.height * this.scale;

            this.angularVelocity += this.velocity.x * 0.02;
            
            this.velocity.y *= -0.9;

            this.velocity.x *= 0.9;
        }
    }

    eat(player) {
        this.eaten = true

        if (this.item === "flesh") {
            if (player.hp < player.maxhp) {
                player.hp += player.vampirism
            }
            if (player.saturation < player.maxsaturation) {
                player.saturation += player.gluttony 
            }
            player.meat += player.gluttony
        }

        if (this.item === "Cactusflesh") {
            if (player.hp < player.maxhp) {
                player.hp += player.vampirism
            }
            if (player.saturation < player.maxsaturation) {
                player.saturation += player.gluttony 
            }
            player.needles += player.gluttony 
        }
    }

    draw(ctx, cameraX) {
        if (this.eaten) return;

        const x = this.coordinates.x - cameraX;
        const y = this.coordinates.y;
        const w = this.width * this.scale;
        const h = this.height * this.scale;

        ctx.save();

        // siirrä keskipisteeseen
        ctx.translate(x + w / 2, y + h / 2);

        // rotaatio
        ctx.rotate(this.angle);

        // piirrä keskitetysti
        ctx.drawImage(
            this.img,
            -w / 2,
            -h / 2,
            w,
            h
        );

        ctx.restore();
    }
}
