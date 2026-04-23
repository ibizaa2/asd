class Wave {
    constructor(ctx, player, world) {
        this.wave = 0
        this.player = player
        this.ctx = ctx
        this.world = world
        this.maxduration = 500
        this.maxspawnrate = 100
        this.spawnrate = 0
        this.duration = this.maxduration
        this.difficulty = 0
        this.scaling = 1

        this.enemies = []
    
    }

    update(ctx, player, cameraX, world) {
        this.duration -= 1;
        this.spawnrate -= 1

        console.log("Vaikeustaso:", this.difficulty)

        
           this.enemies = this.enemies.filter(enemy => enemy.alive)

          this.enemies.forEach(enemy => {
            enemy.distancetoPlayer = Math.abs(enemy.x - player.coordinates.x)
           })

           this.enemies.sort((a, b) => a.distancetoPlayer - b.distancetoPlayer);
        
        if (this.spawnrate <= 0 ) {
            this.spawn(cameraX);
            this.spawnrate = this.maxspawnrate
        }

        if (this.duration <= 0) {
            this.scale();
            this.spawn(cameraX);
            this.Accelerate()
            this.duration = this.maxduration
        }

             for (let enemy of this.enemies) {
                // Tarkista maan collision vihollisille
                checkGroundCollisionForEnemy(enemy, this.world, this.ctx.canvas);

                // Tarkista vihollisten hyökkäys pelaajaan
                if (checkEnemyAttackCollision(player, enemy)) {

                    let damage
                    if (enemy.name === "Cactus"){
                        damage = 2
                    } else {
                        damage = enemy.damage
                    }

                    const didDamage = player.takeDamage(damage);
                          

                    if (didDamage && enemy.name === "Bird") {
                        const sound = player.biteof87.cloneNode();
                        sound.play();
                    }
                    }
                 

                // Tarkista pelaajan hyökkäys vihollisiin
                 player.PlayerProjectiles.forEach(projectile => {
                if (!projectile.shotTargets.includes(enemy) && projectile.isActive && checkProjectileCollisionWithEnemy(projectile, enemy)) {
                    projectile.shotTargets.push(enemy)
                    enemy.takeDamage(projectile.damage);

                    console.log("Ammus osui vihuun etäisyydellä: " + enemy.distancetoPlayer);
               
              
                    
                    // AOE-iskut (chomp) eivät deaktivoidu ensimmäisestä osumasta
                    if (projectile.type !== "chomp") {
                        if (projectile.pierce > 0) {
                           
                            projectile.pierce--; 
                            console.log("Pierceä jäljellä " , projectile.pierce , "Ammus ID ", projectile.id, "Vihun id:", enemy.id);
                        } else {
                            // Jos pierce loppuu, tuhotaan ammus
                            projectile.isActive = false;
                        }
                    }
                }
            });



if (enemy instanceof Cactus) {
    let shootingcd = Math.max(60, 200 - this.difficulty * 15);
    let grenadeChance = Math.min(0.7, 0.1 + this.difficulty * 0.1);

    
    let dx = Math.abs(player.coordinates.x - enemy.x);

    
    if (!enemy.currentWeapon || (enemy.needlecdtimer === 0 && enemy.grenadecdtimer === 0)) {
        
       
        if (Math.random() < grenadeChance) {
            enemy.currentWeapon = "grenade";
        } else {
            enemy.currentWeapon = "needle";
        }

      
        if (!enemy.hasFiredOnce && dx <= 1500) {
            let startcd;
            
            if (enemy.currentWeapon === "grenade") {
                startcd = shootingcd * 1.5;
            } else {
                startcd = shootingcd;
            }
            
            enemy.needlecdtimer = startcd;
            enemy.grenadecdtimer = startcd;
            enemy.hasFiredOnce = true;
        }
    }

   
    let finalcd
    
    if (enemy.currentWeapon === "grenade") {
        finalcd = shootingcd * 1.5;
    } else {
        finalcd = shootingcd;
    }

   
    enemy.update(player, enemy.currentWeapon, finalcd);
} else {
  
    enemy.update(player);
}
        }
    }

    draw(ctx, cameraX) {
        this.enemies.forEach(enemy => enemy.draw(ctx, cameraX));
    }

    scale() {
        this.difficulty += this.scaling
        this.maxduration += this.difficulty
        this.maxspawnrate = Math.max(10, this.maxspawnrate - this.difficulty / 10);
    }
    Accelerate() {
        if (World.time === 0.5) {
            this.scaling += 1
        }
    }

    spawn(cameraX) {
       
        // spawn enemies
            let x = cameraX + this.ctx.canvas.width + Math.random() * 10000
            let y = this.world.height

            let hpBonus = Math.floor(this.difficulty * 0.25);
            let damageBonus = Math.floor(this.difficulty * 0.25);

            if (Math.random() < 0.4) {
                let bird = new Bird(x, y , this.ctx.canvas.height);
                bird.hp += hpBonus
                bird.damage += damageBonus
                this.enemies.push(bird);
            } else {
                let cactus = new Cactus(x, y, this.ctx.canvas.height)
                cactus.hp += hpBonus
                cactus.projectiledamage += damageBonus
                this.enemies.push(cactus)
            }
           
            

            
        this.wave++
    }
}

