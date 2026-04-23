const keys = {
    w: false,
    a: false,
    s: false,
    d: false,
    space: false,
    spaceHeld: false,
    m1: false,
    m2: false,
    r: false
};

const mouse = {
    x: 0,
    y: 0
};

window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

window.addEventListener("contextmenu", (e) => e.preventDefault());

window.addEventListener("mousedown", (e) => {
    if (e.button === 0) keys.m1 = true;
    if (e.button === 2) keys.m2 = true;
    
});

window.addEventListener("mouseup", (e) => {
    if (e.button === 0) keys.m1 = false;
    if (e.button === 2) keys.m2 = false;
});

window.addEventListener("keydown", (e) => {
    if (e.key === "w") keys.w = true;
    if (e.key === "a") keys.a = true;
    if (e.key === "s") keys.s = true;
    if (e.key === "d") keys.d = true;

    if (e.key === " ") {
        if (!keys.spaceHeld) {
            keys.space = true;
            keys.spaceHeld = true;
        }
    }

    if (e.key === "r") {
        keys.r = true;
    }
});

window.addEventListener("keyup", (e) => {
    if (e.key === "w") keys.w = false;
    if (e.key === "a") keys.a = false;
    if (e.key === "s") keys.s = false;
    if (e.key === "d") keys.d = false;

    if (e.key === " ") {
        keys.spaceHeld = false;
    }

    if (e.key === "r") {
        keys.r = false;
    }
});

class Player {
    constructor() {
        // basic stats
        this.maxhp = 100;
        this.hp = this.maxhp;
        this.maxhunger = 100;
        this.hunger = this.maxhunger;
        
        

        this.maxsaturation = 100;
        this.saturation = this.maxsaturation;

        // special stats
        this.strenght = 10
        this.agility = 10
        // %kestävyys
        this.endurance = 0
        // +kestävyys
        this.defence = 0
        // regeneraatio
        this.vitality = 0
        // nälkäisyys
        this.metabolism = 100
        this.luck = 0
        this.gluttony = 1
        this.vampirism = 1

        // gun stats

        // ammo
        this.maxammo = 2;
        this.ammo = this.maxammo;

        // reload
        this.reloading = false
        this.loadMax = 40;
        this.load = 0;
        this.autoload = 0
        // Ammunition reloaded per reload
        this.loadAmount = 1;
        // Needle cost per reload
        this.ammoCost = 1;
        
        // Time between shots
        this.firerateMax = 40;
        this.firerate = 0;

        // ammusta per shot
        this.usage = 1
        
        // spread degrees
        this.spread = 100;
        // range
        this.range = 200;
        // projectile volume
        this.volume = 8
        // damage per shot
        this.firepower = 1;
        // enemy piercing
        this.pierce = 1;
        // player projectiles
        this.PlayerProjectiles = [];

        
        
        // resources

        this.needles = 100;
        this.meat = 100;

        // points

        this.upgrades = 0;
        this.distance = 0;

        // misc
        
        this.size = 1;
        this.shroomTimer = 0

        this.hitbox = {
            collision: { x: -20, y: 10, w: 100, h: 150 },
            hurt: { x: 5, y: 20, w: 60, h: 60 },
            // aktiivinen vain platform tyyppisille rakenteille (Jos tarvitsee)
            platform: { x: -20, y: 165, w: 100, h: 0 }
        }

        this.bitePhase = "idle";
        this.biteProgress = 0;

        this.slamming = false;
        this.slamPower = 0
        this.slamTriggered = false;

        this.direction = "right";

        this.jumpcooldown = 0
        this.jumpPower = 1;
        this.maxjumps = 1;
        this.jumps = 0;

        this.coordinates = { x: 600, y: 400 };
        this.velocity = { x: 0, y: 0 };
        this.gravity = { x: 0, y: 10 };


        // --- PARTS ---

        this.torso = new Image();
        this.torso.src = "Images/Dinosaur/Torso.png";
        this.torso.point = { x: 0, y: 0 };
        this.torso.rotation = 0;
        this.torso.scale = 1;
        this.torso.offset = { x: 0, y: 0 };

        this.head1 = new Image();
        this.head1.src = "Images/Dinosaur/Head1.png";
        this.head1.point = { x: 0, y: 40 };
        this.head1.rotation = 0;
        this.head1.scale = 1;
        this.head1.offset = { x: 58, y: -8 };
        // Bite point
        this.head1.firepoint = 50;
        this.blackhole = false
        this.blackholeCenter = { 
            x: this.coordinates.x + (this.head1.offset?.x || 0) * this.size * this.head1.scale + this.head1.firepoint * this.size * this.head1.scale, 
            y: this.coordinates.y + (this.head1.offset?.y || 0) * this.size * this.head1.scale
        }

        this.head2 = new Image();
        this.head2.src = "Images/Dinosaur/Head2.png";
        this.head2.point = { x: 0, y: 0 };
        this.head2.rotation = 0;
        this.head2.scale = 1;
        this.head2.offset = { x: 60, y: 25 };

        this.hand1  = new Image();
        this.hand1.src = "Images/Dinosaur/Hand1.png";
        this.hand1.point = { x: 0, y: 0 };
        this.hand1.rotation = 0;
        this.hand1.scale = 1;
        this.hand1.offset = { x: 10, y: 15 };

        this.hand2 = new Image();
        this.hand2.src = "Images/Dinosaur/Hand2.png";
        this.hand2.point = { x: 0, y: 0 };
        this.hand2.rotation = 0;
        this.hand2.scale = 1;
        this.hand2.offset = { x: 60, y: 70 };

        this.leg1 = new Image();
        this.leg1.src = "Images/Dinosaur/Leg1.png";
        this.leg1.point = { x: 60, y: 40 };
        this.leg1.rotation = 0;
        this.leg1.scale = 1;
        this.leg1.offset = { x: -37.5, y: 10 };

        this.leg2 = new Image();
        this.leg2.src = "Images/Dinosaur/Leg2.png";
        this.leg2.point = { x: 20, y: 0 };
        this.leg2.rotation = 0;
        this.leg2.scale = 1;
        this.leg2.offset = { x: 30, y: 70 };

        this.shotgun = new Image();
        this.shotgun.src = "Images/Shotgun.png";
        this.shotgun.point = { x: 50, y: 7.5 };
        this.shotgun.rotation = 0;
        this.shotgun.scale = 1;
        this.shotgun.offset = { x: -25, y: 100 };
        // End of the barrel
        this.shotgun.firepoint = 130;

        // --- sounds ---

        this.shootAudio = new Audio("Audio/shotgun_shot.wav")
        this.reloadAudio = new Audio("Audio/shotgun_reload.wav")
        this.biteof87 = new Audio("Audio/Bite.wav")

        this.slamboom = new Audio("Audio/Explosion.wav");
        this.slamboom.preload = "auto";
        

        this.deathAudio = new Audio("Audio/Player.death.wav")

        
        this.alive = true;
        this.invincibletimer = 0;

        
    }

    update() {

        this.jumpcooldown--

        if (this.shroomTimer > 0){
            this.shroomTimer--
        }

        if (this.invincibletimer > 0){
            this.invincibletimer --;
        }

        if (this.hp < this.maxhp) {
            this.hp += this.vitality * 2 / this.metabolism
        }
        if (this.firerate > 0) {
            this.firerate -= 1;
        }

        this.blackholeCenter = {
            x: this.coordinates.x + (this.head1.offset?.x || 0) * this.size + this.head1.point.x * this.size * this.head1.scale + this.head1.firepoint * this.size, 
            y: this.coordinates.y + (this.head1.offset?.y || 0) * this.size + this.head1.point.y * this.size * this.head1.scale
        }

        if (this.saturation > 0) {
            this.saturation -= this.metabolism * 0.0001;
        } else {
            this.hp -= this.metabolism / 10
            this.saturation = 0
            this.takeDamage(0)
        }
        if (this.slamming) {
            this.velocity.x *= 2
        }

        this.velocity.x /= 2;
        this.velocity.y /= 2;

        this.velocity.x += this.gravity.x
        this.velocity.y += this.gravity.y

        this.coordinates.x += this.velocity.x
            
        this.coordinates.y += this.velocity.y

        this.PlayerProjectiles.forEach(projectile => projectile.update());
        this.PlayerProjectiles = this.PlayerProjectiles.filter(projectile => projectile.isActive);

        // pyöritys korjaus
        const parts = [this.torso, this.head1, this.head2, this.hand1, this.hand2, this.leg1, this.leg2, this.shotgun];
        for (const part of parts) {
            while (part.rotation >= 360) {
                part.rotation -= 360;
            }
        }
    }

    draw(ctx, cameraX) {
        const x = this.coordinates.x - cameraX;
        const y = this.coordinates.y;

        this.modification(ctx, this.leg1, x, y);
        this.modification(ctx, this.leg2, x, y);

        this.modification(ctx, this.torso, x, y);

        this.modification(ctx, this.head2, x, y);
        this.modification(ctx, this.head1, x, y); 

        this.modification(ctx, this.hand2, x, y);
        this.modification(ctx, this.shotgun, x, y);
        this.modification(ctx, this.hand1, x, y);

        

        this.drawPlayerProjectiles(ctx, cameraX);
    }

    drawPlayerProjectiles(ctx, cameraX) {
        this.PlayerProjectiles.forEach(projectile => projectile.drawBullet(ctx, cameraX));
    }

    modification(ctx, part, x, y) {
        ctx.save();

        const offsetX = (part.offset?.x || 0) * this.size;
        const offsetY = (part.offset?.y || 0) * this.size;

        const finalScale = this.size * part.scale;

        ctx.translate(x + offsetX, y + offsetY);

        ctx.translate(part.point.x * finalScale, part.point.y * finalScale);

        ctx.rotate(part.rotation);

        ctx.drawImage(
            part,
            -part.point.x * finalScale,
            -part.point.y * finalScale,
            part.width * finalScale,
            part.height * finalScale
        );

        ctx.restore();
    }
   
    takeDamage(amount) {
        if (this.hp <= 1) {
            this.alive = false
        }
        if (this.invincibletimer > 0 || !this.alive) {
            return false; // EI damagea
        }

        let damageTaken = amount;

        damageTaken *= 1 - (this.endurance / 100);
        damageTaken -= this.defence;
        damageTaken = Math.max(0, damageTaken);

        this.hp -= damageTaken;
        this.invincibletimer = 30;

        return true; // damage meni läpi
    }

    eat(drops) {
        for (const drop of drops) {
            if (drop.eaten) continue;
            
            for (const projectile of this.PlayerProjectiles) {
                if (projectile.type !== "chomp") continue;

                const radiusSq = projectile.radius * projectile.radius;

                const dropLeft   = drop.coordinates.x + drop.hitbox.x;
                const dropTop    = drop.coordinates.y + drop.hitbox.y;
                const dropRight  = dropLeft + drop.hitbox.w * drop.scale;
                const dropBottom = dropTop + drop.hitbox.h * drop.scale;

                if (circleIntersectsRect(
                    projectile.startX,
                    projectile.startY,
                    projectile.radius,
                    dropLeft,
                    dropTop,
                    dropRight,
                    dropBottom
                )) {
                    drop.eat(this);
                    break;
                }
            }
        }
    }

    bite(CameraX) {
        const maxRotation = Math.PI / 4;
        const speed = 0.3;

        if (keys.m2) {
            this.bitePhase = "in";
        }

        if (this.bitePhase === "in") {
            this.biteProgress += speed / 15 * this.strenght / 10;
            this.blackhole = true

            if (this.biteProgress >= 1) {
                this.biteProgress = 1;
                this.bitePhase = "out";
            }

            this.head1.rotation = -maxRotation * this.biteProgress;
            this.head2.rotation = maxRotation * this.biteProgress;

        } else if (this.bitePhase === "out") {
            this.biteProgress -= 1;

            if (this.biteProgress <= 0) {
                const centerX = this.coordinates.x + (this.head1.offset?.x || 0) * this.size + this.head1.point.x * this.size * this.head1.scale + this.head1.firepoint * this.size
                const centerY = this.coordinates.y + (this.head1.offset?.y || 0) * this.size + this.head1.point.y * this.size * this.head1.scale
                const ammo = new Ammo(0, this, centerX, centerY, "chomp");
                ammo.damage = this.strenght;
                this.PlayerProjectiles.push(ammo);
                this.biteProgress = -0.4;
                this.biteof87.currentTime = 0
                this.biteof87.play()
                this.bitePhase = "idle";
                this.blackhole = false
            }

            this.head1.rotation = -maxRotation * this.biteProgress;
            this.head2.rotation = maxRotation * this.biteProgress;

        } else {
            this.head1.rotation += (0 - this.head1.rotation) * 0.1;
            this.head2.rotation += (0 - this.head2.rotation) * 0.1;
        }
    }

    

    useAmmo(amount) {
        this.ammo -= amount;
        if (this.ammo < 0) this.ammo = 0;
    }

    walk() {
        if (keys.a && keys.d) return;

        const speed = 0.025 * this.agility;

        if (this.leg1.rotation > Math.PI) {
            this.leg1.rotation -= 2 * Math.PI;
        }
        if (this.leg1.rotation < -Math.PI) {
            this.leg1.rotation += 2 * Math.PI;
        }

        if (this.leg2.rotation > Math.PI) {
            this.leg2.rotation -= 2 * Math.PI;
        }
        if (this.leg2.rotation < -Math.PI) {
            this.leg2.rotation += 2 * Math.PI;
        }

        if (keys.a) {
            this.coordinates.x -= this.agility;
            this.velocity.x -= this.agility;

            this.leg1.rotation -= speed;
            this.leg2.rotation = this.leg1.rotation + Math.PI;
            
        } else if (keys.d) {
            this.coordinates.x += this.agility;
            this.velocity.x += this.agility;

            this.leg1.rotation += speed;
            this.leg2.rotation = this.leg1.rotation + Math.PI;
        } else {
            this.leg1.rotation *= 0.95;
            this.leg2.rotation *= 0.95;
        }
    }

    aim(camera) {
        const x = this.coordinates.x + this.shotgun.offset.x * this.size + this.shotgun.point.x * this.size - camera;
        const y = this.coordinates.y + this.shotgun.offset.y * this.size + this.shotgun.point.y * this.size ;

        const dx = mouse.x - x;
        const dy = mouse.y - y;

        this.shotgun.rotation = Math.atan2(dy, dx);
    }

    shoot() {
        if (keys.m1 && this.ammo >= this.usage && this.load <= 0 && this.firerate <= 0) {
            this.firerate = this.firerateMax;
            this.useAmmo(this.usage);
            this.shootAudio.currentTime = 0;
            this.shootAudio.play();
            // Create instant light-speed shot lines
            const centerX = this.coordinates.x + this.shotgun.offset.x * this.size + this.shotgun.point.x * this.size * this.shotgun.scale;
            const centerY = this.coordinates.y + this.shotgun.offset.y * this.size + this.shotgun.point.y * this.size * this.shotgun.scale;
            const fireX = centerX + Math.cos(this.shotgun.rotation) * this.shotgun.firepoint * this.size * this.shotgun.scale;
            const fireY = centerY + Math.sin(this.shotgun.rotation) * this.shotgun.firepoint * this.size * this.shotgun.scale;

            for (let i = 0; i < this.volume; i++) {
                const direction = this.shotgun.rotation + (Math.random() - 0.5) * (this.spread * Math.PI / 180);
                const ammo = new Ammo(direction, this, fireX, fireY);
                ammo.damage = this.firepower; // 1 damage per bullet
                this.PlayerProjectiles.push(ammo);
            }
        }
    }
    
    reload() {
        if (this.autoload > 0 && this.ammo < this.maxammo && this.needles >= this.ammoCost) {
            const amount = Math.min(this.autoload, this.maxammo - this.ammo);

            this.ammo += amount;
            this.needles -= this.ammoCost * amount;
        }

        if (keys.r) {
            this.reloading = true;
        }

        if (this.ammo >= this.maxammo || this.needles < this.ammoCost) {
            this.reloading = false;
        }

        if (!this.reloading) return;

        if (this.load > 0) {
            this.load--;

            if (this.load <= 0) {
                const amount = Math.min(this.loadAmount, this.maxammo - this.ammo);

                this.ammo += amount;
                this.needles -= this.ammoCost * amount;
            }

            return;
        }

        // Käynnistä seuraava shell
        this.load = this.loadMax;

        const sound = this.reloadAudio.cloneNode();
        sound.currentTime = 0;
        sound.play();
    }

    jump() {
        if (this.jumps > 0 && keys.space && !this.slamming && this.jumpcooldown < 0) {
            this.jumps--;
            if (this.onGround) {
                this.velocity.y -= this.jumpPower * 1000;
            } else {
                this.velocity.y -= this.jumpPower * 500
            }

            this.jumpcooldown = 10
            

            const targetRotation = Math.PI * 1.5;
            const step = targetRotation * 0.25;

            this.leg1.rotation += step;
            if (this.leg1.rotation < -targetRotation) this.leg1.rotation = -targetRotation;

            this.leg2.rotation -= step;
            if (this.leg2.rotation > targetRotation) this.leg2.rotation = targetRotation;

            keys.space = false;
        } else {
            keys.space = false
        }
    }
    slam() {
        if (keys.s && !player.onGround) {
            this.velocity.y += this.jumpPower * this.size * (0 + this.slamPower) * 10;
            this.leg1.rotation = 0
            this.leg2.rotation = 0
            this.slamming = true
            this.slamPower += this.size
        } else {
            
            
            if (this.slamPower >= 9 * this.size && !this.slamTriggered) {
                this.slamTriggered = true;

                const hitbox = this.hitbox.collision;

                const blastX = this.coordinates.x + hitbox.x + hitbox.w / 2;
                const blastY = this.coordinates.y + hitbox.y + hitbox.h / 2;

                const blast = new Ammo(0, this, blastX, blastY, "Blast");
                blast.damage = this.strenght * this.slamPower / 60;
                this.PlayerProjectiles.push(blast);


                const sound = this.slamboom.cloneNode();
                sound.currentTime = 0.375
                sound.play();
            }
            if (player.onGround) {
                this.slamming = false;
                this.slamPower = 0;
                this.slamTriggered = false;
            }
        }
    }
    glide() {
        if (keys.w && !player.onGround) {
            this.velocity.y -= this.gravity.y * 1.75
            this.leg1.rotation = 90
            this.leg2.rotation = -90
        }
    }
}
