let drops = []

function rollDrops(baseAmount, luck) {
    const drops = [];

    const luckMultiplier = 1 + luck;

    for (let i = 0; i < baseAmount; i++) {
        if (i === 0) {
            drops.push(true);
            continue;
        }

        let chance = (1 / Math.pow(1.25, i)) * luckMultiplier;

        if (chance > 1) chance = 1;

        if (Math.random() < chance) {
            drops.push(true);
        } else {
            break;
        }
    }

    return drops.length;
}

class Bird {
    constructor(x, groundHeight, canvasHeight) {
        this.id = Math.random()
        this.name = "Bird"
        
        this.x = x; 
        this.y = 100; 
        this.vx = 0; 
        this.vy = 0;
        this.scale = 1.0; 
        this.time = 0;

        this.hitbox = { x: 5, y: 90, w: 30, h: 30 } // vahingoittaa pelaajaa
        this.hurtbox = { x: 0, y: 70, w: 170, h: 80 } // ottaa vahinkoa osumista

        this.hp = 3;
        this.alive = true;
        this.damage = 5;

        this.img = new Image();
        this.img.src = "Images/Bird.png";

        this.img.onload = () => {
            this.width = this.img.width * this.scale;
            this.height = this.img.height * this.scale;
       
            this.y = canvasHeight - groundHeight - this.height - 300;
        };
        this.loot = "flesh"
        this.LootDropped = false
    }

      update(player) {
        if (!player || !player.coordinates) return;

        // Lasketaan koordinaatti erotukset
        let targetX = player.coordinates.x + (player.hitbox.hurt.x + player.hitbox.hurt.w / 2) * player.size;
    let targetY = player.coordinates.y + (player.hitbox.hurt.y + player.hitbox.hurt.h / 2 - 90) * player.size
        let dx = targetX - this.x
        let dy = targetY - this.y

        // Lasketaan kulma linnun ja pelaajan välillä
        let angle = Math.atan2(dy, dx);


        // Lisätään linnun nopeutta, jotta se syöksyy pelaajaa päin
        // Cos laskee mihin suuntaan pitää mennä x-akselilla, sin taas laskee y-akselin

        let distance = Math.abs(dx);

        if (distance <= 1200) {
            this.vx += Math.cos(angle) * 2
            this.vy += Math.sin(angle) * 2
        
        this.vx *= 0.95;
        this.vy *= 0.95;

        this.x += this.vx;
        this.y += this.vy;


      
        }
    }

    takeDamage(amount){
        this.hp -= amount;

         console.log("Vihollisella ",this.name, "hp jäljellä", this.hp)

           if(this.hp <= 0 && this.alive === true){
            this.alive = false;
        }

    }

    draw(ctx, cameraX) {
      
        if (this.alive) {
            ctx.drawImage(this.img, this.x - cameraX, this.y, this.width, this.height);
        } else {
            const death = new Audio("Audio/bird.death.wav")
            death.play()

            if (!this.LootDropped) {
                const amount = rollDrops(10, player.luck); // baseAmount = max yritykset

                for (let i = 0; i < amount; i++) {
                    drops.push(new Drops(this.x, this.y, this.loot));
                }

                this.LootDropped = true;
            }
        }
        
    }
}

class Cactus {
    constructor(x, groundHeight, canvasHeight) {
        this.needlecdtimer = 0;
        this.grenadecdtimer = 0;
        this.currentWeapon = null

        this.id = Math.random() 
        this.name = "Cactus"

        this.cooldown = 0;
        this.hp = 6

        this.hitbox = { x: 30, y: 0, w: 80, h: 240 } // vahingoittaa pelaajaa
        this.hurtbox = { x: 30, y: 0, w: 80, h: 240 } // ottaa vahinkoa osumasta

        this.needleScale = 2;
        this.needles = []
        this.needlesImg = new Image();
        this.needlesImg.src = "Images/Needle projectile.png"

        this.grenadeboom = new Audio();
        this.grenadeboom.src = "Audio/Grenade.Boom.wav"

        this.grenadeImg = new Image()
        this.grenadeImg.src = "Images/Cactus grenade.png"

       this.launchgrenade = false;

       this.projectiledamage = 0

       this.damage = 0;
       this.alive = true;

        this.x = x; 
        this.scale = 0.50; 
        this.img = new Image();
        this.img.src = "Images/Cactus.png";

           this.img.onload = () => {
            this.width = this.img.width * this.scale;
            this.height = this.img.height * this.scale;
            
           
            this.y = canvasHeight - groundHeight - this.height 
        };
        this.loot = "Cactusflesh"

        this.needlesImg.onload = () => {
    this.needleWidth = this.needlesImg.width * this.needleScale;
    this.needleHeight = this.needlesImg.height * this.needleScale;
};
    }

        takeDamage(amount){
        this.hp -= amount;
       console.log("Vihollisella ",this.name, "hp jäljellä", this.hp)
        
           if(this.hp <= 0 && this.alive === true){
            this.alive = false;
        }

    }

draw(ctx, cameraX) {
    if (this.alive) {
        ctx.drawImage(this.img, this.x - cameraX, this.y, this.width, this.height);
    } else {

        const death = new Audio("Audio/cactus.death.wav")
        death.currentTime = 0.5
        death.play()

        if (!this.LootDropped) {
            const amount = rollDrops(10, player.luck);

            for (let i = 0; i < amount; i++) {
                drops.push(new Drops(this.x, this.y, this.loot));
            }

            this.LootDropped = true;
        }
    }
    
    this.needles.forEach(needle => {

        let pic = needle.img || this.needlesImg;
        
        needle.drawProjectile(ctx, cameraX, pic, this.needleWidth, this.needleHeight);
    });
}

explode(startX, startY) {
    
    let spawnY = startY - 100

    for (let i = 0; i < 8; i++) {
        let angle = (Math.PI * 2 / 8) * i

        let newNeedle = new Ammo(angle, this, startX, spawnY, "projectile");

        
        newNeedle.damage = 3 + this.projectiledamage;
        
        newNeedle.img = this.needlesImg;
        newNeedle.width = this.needleWidth;
        newNeedle.height = this.needleHeight;
        newNeedle.isGrenade = false;

        this.needles.push(newNeedle);
    }
}
    update(player, projectiletype, cooldown){
        let distanceX = Math.abs(player.coordinates.x - this.x)

        this.needlecdtimer++
        this.grenadecdtimer++
        
        let currentTimer;
        if (projectiletype === "grenade"){
            currentTimer = this.grenadecdtimer

        } else {
            currentTimer = this.needlecdtimer
        }

        

        if(currentTimer >=  cooldown && distanceX <= 1500){

       

            let dx = player.coordinates.x - this.x
            let dy = player.coordinates.y - this.y

          
            let time = Math.max(40, distanceX / 15)

            let gravity = 0.5

         
            let velocityX = dx / time

          
            let velocityY = dy / time

            // Lasketaan kuinka paljon painovoima tiputtaa ammusta lennon aikana ja kumotaan se
            let reversegravity = 0.5 * gravity * time



            let newNeedle = new Ammo(0, this, this.x, this.y, "projectile");
            newNeedle.vx = velocityX
            newNeedle.vy = velocityY - reversegravity

            if (projectiletype === "grenade"){
                newNeedle.img = this.grenadeImg
                newNeedle.isGrenade = true
                newNeedle.damage = 6 + this.projectiledamage
                this.grenadecdtimer = 0;
                
            } else {
                newNeedle.img = this.needlesImg;
                newNeedle.isGrenade = false
                newNeedle.damage = 3 + this.projectiledamage
                this.needlecdtimer = 0
            }
            
            newNeedle.width = this.needleWidth;
            newNeedle.height = this.needleHeight;
            this.needles.push(newNeedle);
            this.cooldown = 0;
        }
        this.needles.forEach(needle =>  {
            
         
            needle.update()

            const hitbox = {
            x: needle.startX,
            y: needle.startY,
            width: needle.width,
            height: needle.height
        };
        
         
            let groundBoom = needle.startY > 800
            let playerBoom = player && checkProjectileCollisionWithPlayer(player, hitbox)

            if(groundBoom || playerBoom ){
                if (playerBoom && needle.isActive){
                    player.takeDamage(needle.damage)
                }


            if (needle.isGrenade) {
        let distance = Math.abs(player.coordinates.x - needle.startX);

        if (distance <= 1000) {
            this.grenadeboom.currentTime = 0;
            this.grenadeboom.play();
        }
        
        
        this.explode(needle.startX, needle.startY - 5);
    }
     needle.isActive = false;
            }
            if (checkProjectileCollisionWithPlayer(player, hitbox)){

                player.takeDamage(needle.damage)
                console.log("neula/kranaatti osui pelaajaan");
                needle.isActive = false;

                const hitSound = new Audio()
                hitSound.src = "Audio/Cactus.hit.wav"
                hitSound.currentTime = 0
                hitSound.play()
  
            }
            });
            this.needles = this.needles.filter(needle => needle.isActive)
        }
    }
