function checkGroundCollision(player, world, canvas) {
    // Canvaksen Y-akseli alkaa 0:sta (hahmon ylin osa) ja kasvaa alaspäin
    // Canvaksen X-akseli alkaa 0:sta (hahmon vasen osa) ja kasvaa oikealle
    
    const groundLevel = canvas.height - world.height;

    const hitbox = player.hitbox.collision
  
    const playerBottom = player.coordinates.y + (hitbox.y + hitbox.h) * player.size

    if (playerBottom > groundLevel) {
        
        // Asetetaan dinon sijainti niin, että jalat ovat maan pinnalla
        player.coordinates.y = groundLevel - (hitbox.y + hitbox.h) * player.size
        player.velocity.y *= -1;

        if (player.jumpcooldown < 0) {
            player.jumps = player.maxjumps
        }

        player.onGround = true;

    } else {
        player.onGround = false;
    }
}

function checkGroundCollisionForEnemy(enemy, world, canvas) {
    const groundLevel = canvas.height - world.height;

    const hitbox = enemy.hitbox;
    const enemyBottom = enemy.y + hitbox.y + hitbox.h;

    if (enemyBottom > groundLevel) {
        enemy.y = groundLevel - hitbox.y - hitbox.h;
        enemy.vy = 0; // Pysäytä pystysuuntainen liike
        enemy.onGround = true;
    } else {
        enemy.onGround = false;
    }
}

function checkObjectCollision(player, obstacle) {
   
    const objectLeft = obstacle.x;
    const objectRight = objectLeft + obstacle.width;
    const objectTop = obstacle.y;
    const objectBottom = objectTop + obstacle.height;

    const hitbox = player.hitbox.collision
  
    const playerLeft = player.coordinates.x + hitbox.x * player.size;
    const playerRight = playerLeft + hitbox.w * player.size
    const playerTop = player.coordinates.y + hitbox.y * player.size;
    const playerBottom = playerTop + hitbox.h * player.size;

   
    if (
        playerRight >= objectLeft   && // Pelaajan oikea reuna osuu esteen vasempaan reunaan
        playerLeft  <= objectRight  && // Pelaajan vasen reuna osuu esteen oikeaan reunaan
        playerBottom >= objectTop    && // Pelaajan jalat osuu esteen huippuun
        playerTop <= objectBottom    // Pelaajan pää osuu esteen pohjaan
    ) {
        console.log("törmäys")
        return true;
        
    } return false;
}

function checkPlayerAttackCollision(player, enemy) {
    const playerHurtbox = player.hitbox.hurt;
    const enemyHurtbox = enemy.hurtbox;

    const playerLeft = player.coordinates.x + playerHurtbox.x * player.size;
    const playerRight = playerLeft + playerHurtbox.w * player.size;
    const playerTop = player.coordinates.y + playerHurtbox.y * player.size;
    const playerBottom = playerTop + playerHurtbox.h * player.size;

    const enemyLeft = enemy.x + enemyHurtbox.x;
    const enemyRight = enemyLeft + enemyHurtbox.w;
    const enemyTop = enemy.y + enemyHurtbox.y;
    const enemyBottom = enemyTop + enemyHurtbox.h;

    return (
        playerRight >= enemyLeft &&
        playerLeft <= enemyRight &&
        playerBottom >= enemyTop &&
        playerTop <= enemyBottom
    );
}

function checkEnemyAttackCollision(player, enemy) {
    const playerHurtbox = player.hitbox.hurt;
    const enemyHitbox = enemy.hitbox;

    const playerLeft = player.coordinates.x + playerHurtbox.x * player.size;
    const playerRight = playerLeft + playerHurtbox.w * player.size;
    const playerTop = player.coordinates.y + playerHurtbox.y * player.size;
    const playerBottom = playerTop + playerHurtbox.h * player.size;

    const enemyLeft = enemy.x + enemyHitbox.x;
    const enemyRight = enemyLeft + enemyHitbox.w;
    const enemyTop = enemy.y + enemyHitbox.y;
    const enemyBottom = enemyTop + enemyHitbox.h;

    return (
        playerRight >= enemyLeft &&
        playerLeft <= enemyRight &&
        playerBottom >= enemyTop &&
        playerTop <= enemyBottom
    );
}

function checkProjectileCollisionWithPlayer(player, projectileHitbox) {
    // Projektion collision pelaajan hurtboxiin
    const playerHurtbox = player.hitbox.hurt;

    const playerLeft = player.coordinates.x + playerHurtbox.x * player.size;
    const playerRight = playerLeft + playerHurtbox.w * player.size;
    const playerTop = player.coordinates.y + playerHurtbox.y * player.size;
    const playerBottom = playerTop + playerHurtbox.h * player.size;

    const projectileLeft = projectileHitbox.x;
    const projectileRight = projectileLeft + projectileHitbox.width;
    const projectileTop = projectileHitbox.y;
    const projectileBottom = projectileTop + projectileHitbox.height;

    return (
        playerRight >= projectileLeft &&
        playerLeft <= projectileRight &&
        playerBottom >= projectileTop &&
        playerTop <= projectileBottom
    );
}

function checkProjectileCollisionWithEnemy(projectile, enemy) {
    // Projektion collision vihollisten hurtboxiin
    const enemyHurtbox = enemy.hurtbox;

    const enemyLeft = enemy.x + enemyHurtbox.x;
    const enemyRight = enemyLeft + enemyHurtbox.w;
    const enemyTop = enemy.y + enemyHurtbox.y;
    const enemyBottom = enemyTop + enemyHurtbox.h;

    // Haulikkoammukset (bullet) ovat "valonnopeita" - tarkista koko ammuksen pituus
    if (projectile.type === "bullet") {
        const endX = projectile.startX + Math.cos(projectile.direction) * projectile.range;
        const endY = projectile.startY + Math.sin(projectile.direction) * projectile.range;
        return lineIntersectsRect(projectile.startX, projectile.startY, endX, endY, enemyLeft, enemyTop, enemyRight, enemyBottom);
    }
    
    // Muut projektiilit käyttävät pistetarkistusta
    // Chomp (AOE) käyttää ympyrä-tarkistusta
    if (projectile.type === "chomp" || projectile.type === "Blast") {
        return circleIntersectsRect(
            projectile.startX,
            projectile.startY,
            projectile.radius,
            enemyLeft,
            enemyTop,
            enemyRight,
            enemyBottom
        );
    }
    
    const projectileLeft = projectile.startX;
    const projectileRight = projectileLeft + projectile.width;
    const projectileTop = projectile.startY;
    const projectileBottom = projectileTop + projectile.height;

    return (
        projectileRight >= enemyLeft &&
        projectileLeft <= enemyRight &&
        projectileBottom >= enemyTop &&
        projectileTop <= enemyBottom
    );
}

// Tarkistaa, osuuko jana (x1,y1)-(x2,y2) suorakulmioon
function lineIntersectsRect(x1, y1, x2, y2, rx1, ry1, rx2, ry2) {
    // Tarkista ensin, onko jompikumpi päätepiste suorakulmion sisällä
    if (pointInRect(x1, y1, rx1, ry1, rx2, ry2) || pointInRect(x2, y2, rx1, ry1, rx2, ry2)) {
        return true;
    }
    // Tarkista leikkaus suorakulmion sivujen kanssa
    if (lineIntersectsLine(x1, y1, x2, y2, rx1, ry1, rx1, ry2)) return true;
    if (lineIntersectsLine(x1, y1, x2, y2, rx2, ry1, rx2, ry2)) return true;
    if (lineIntersectsLine(x1, y1, x2, y2, rx1, ry1, rx2, ry1)) return true;
    if (lineIntersectsLine(x1, y1, x2, y2, rx1, ry2, rx2, ry2)) return true;
    return false;
}

function pointInRect(px, py, rx1, ry1, rx2, ry2) {
    return px >= rx1 && px <= rx2 && py >= ry1 && py <= ry2;
}

function lineIntersectsLine(x1, y1, x2, y2, x3, y3, x4, y4) {
    const denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
    if (Math.abs(denom) < 0.0001) return false;
    const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;
    const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom;
    return ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1;
}

// Tarkistaa, osuuko ympyrä suorakulmioon
function circleIntersectsRect(cx, cy, radius, rx1, ry1, rx2, ry2) {
    // Etsi lähin piste suorakulmiossa ympyrän keskipisteeseen
    const closestX = Math.max(rx1, Math.min(cx, rx2));
    const closestY = Math.max(ry1, Math.min(cy, ry2));
    
    // Laske etäisyys ympyrän keskipisteestä lähimpään pisteeseen
    const distanceX = cx - closestX;
    const distanceY = cy - closestY;
    const distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);
    
    return distanceSquared <= (radius * radius);
}