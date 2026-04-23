class Debug {
    constructor(player, wave) {
        this.showImages = false;
        this.showHitboxes = false
        this.showEnemyHitboxes = false
        this.showDropHitboxes = false
        this.player = player;
        this.wave = wave

        this.angle = 0

        window.addEventListener("keydown", (e) => {
            if (e.key === "1") {
                this.showImages = !this.showImages;
                console.log("Näytä kuvia: " + this.showImages);
            }
            if (e.key === "2") {
                this.showHitboxes = !this.showHitboxes;
                console.log("Näytä pelaajan hitbox: " + this.showHitboxes);
            }
            if (e.key === "3") {
                this.showEnemyHitboxes = !this.showEnemyHitboxes;
                console.log("Näytä vihollisten hitbox: " + this.showEnemyHitboxes);
            }
            if (e.key === "4") {
                this.showDropHitboxes = !this.showDropHitboxes;
                console.log("Näytä droppien hitbox: " + this.showDropHitboxes);
            }
        });
    }

    draw(ctx, cameraX) {
        if (this.showImages === true) {
            const parts = [
            /* piilotus alue 
                
            */
            this.player.head2,
            this.player.head1,
            this.player.torso,
            this.player.hand2,
                
            this.player.hand1,
            this.player.leg1,
            this.player.leg2,
            this.player.shotgun
        ];

        parts.forEach(part => {
            this.drawPart(ctx, part, this.player.coordinates.x - cameraX, this.player.coordinates.y);
        });

        /* piilotus alue
            
        */
        this.drawShotgunSpecial(ctx, cameraX);
        this.drawHeadSpeacial(ctx, cameraX)
        }

        if (this.showHitboxes === true) {
            const hitboxes = [
                /* piilotus alue

                */
                this.player.hitbox.collision,
                this.player.hitbox.hurt,
                this.player.hitbox.platform
        ]

        hitboxes.forEach(hitbox => {
            /* piilotus alue
            
            */
            this.drawHitbox(ctx, hitbox, this.player.coordinates.x - cameraX, this.player.coordinates.y)
        })
        
        }

        // Piirrä vihollisten hitboxet
        if (this.showEnemyHitboxes === true && this.wave && this.wave.enemies) {
            this.wave.enemies.forEach(enemy => {
                this.drawEnemyHitboxes(ctx, enemy, cameraX);
            });
        }

        if (this.showDropHitboxes === true && drops.length > 0) {
            drops.forEach(drop => {
                this.drawDropHitboxes(ctx, drop, cameraX)
            })
        }
    }

    drawPart(ctx, part, x, y) {
        const offsetX = (part.offset?.x || 0) * this.player.size;
        const offsetY = (part.offset?.y || 0) * this.player.size;
        const finalScale = this.player.size * part.scale;

        const w = part.width || part.naturalWidth || 0;
        const h = part.height || part.naturalHeight || 0;

        ctx.save();

        ctx.translate(x + offsetX, y + offsetY);

        ctx.translate(part.point.x * finalScale, part.point.y * finalScale);

        ctx.rotate(part.rotation);

        ctx.scale(finalScale, finalScale);

        ctx.strokeStyle = "red";
        ctx.lineWidth = 2 / finalScale;
        ctx.strokeRect(
            -part.point.x,
            -part.point.y,
            w,
            h
        );

        ctx.fillStyle = "blue";
        ctx.beginPath();
        ctx.arc(0, 0, 4 / finalScale, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "lime";
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(40 / finalScale, 0);
        ctx.stroke();

        ctx.restore();
    }
    // Haulikko special debug
    drawShotgunSpecial(ctx, cameraX) {
        const part = this.player.shotgun;
        const centerX = this.player.coordinates.x + (part.offset?.x || 0) * this.player.size + part.point.x * this.player.size * part.scale -cameraX;
        const centerY = this.player.coordinates.y + (part.offset?.y || 0) * this.player.size + part.point.y * this.player.size * part.scale;

        const angle = part.rotation;

        // Draw firepoint as a circle
        ctx.save();
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = "yellow";
        ctx.beginPath();
        ctx.arc(centerX + Math.cos(angle) * part.firepoint * this.player.size * part.scale, centerY + Math.sin(angle) * part.firepoint * this.player.size * part.scale, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Draw spread area
        ctx.save();
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = "orange";
        ctx.beginPath();
        const fireX = centerX + Math.cos(angle) * part.firepoint * this.player.size * part.scale;
        const fireY = centerY + Math.sin(angle) * part.firepoint * this.player.size * part.scale;
        ctx.arc(fireX, fireY, this.player.range, angle - (this.player.spread / 2) * (Math.PI / 180), angle + (this.player.spread / 2) * (Math.PI / 180));
        ctx.lineTo(fireX, fireY);
        ctx.fill();
        ctx.restore();
    }
    // puraisu special debug
    drawHeadSpeacial(ctx, cameraX) {
        const part = this.player.head1
        const centerX = this.player.coordinates.x + (part.offset?.x || 0) * this.player.size + part.point.x * this.player.size * part.scale - cameraX;
        const centerY = this.player.coordinates.y + (part.offset?.y || 0) * this.player.size + part.point.y * this.player.size * part.scale;

        const angle = 0

        // draw firepoint as circle
        ctx.save();
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(centerX + Math.cos(angle) * part.firepoint * this.player.size * part.scale, centerY + Math.sin(angle) * part.firepoint * this.player.size * part.scale, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // draw AOE area
        ctx.save()
        ctx.globalAlpha = 0.3
        ctx.fillStyle = "blue"
        ctx.beginPath()
        ctx.arc(centerX + Math.cos(angle) * part.firepoint * this.player.size * part.scale, centerY + Math.sin(angle) * part.firepoint * this.player.size * part.scale, this.player.size * this.player.head1.scale * (50 + this.player.strenght), 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
    }
    drawHitbox(ctx, hitbox, offsetX = 0, offsetY = 0) {

        ctx.save();

        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;

        ctx.strokeRect(
            offsetX + hitbox.x,
            offsetY + hitbox.y,
            hitbox.w * this.player.size,
            hitbox.h * this.player.size
        );

        ctx.restore();
    }

    drawEnemyHitboxes(ctx, enemy, cameraX) {
        if (!enemy) return;

        const enemyScreenX = enemy.x - cameraX;
        const enemyScreenY = enemy.y;

        ctx.save();

        // Piirrä hitbox (sininen)
        if (enemy.hitbox) {
            ctx.strokeStyle = "cyan";
            ctx.lineWidth = 2;
            ctx.strokeRect(
                enemyScreenX + enemy.hitbox.x,
                enemyScreenY + enemy.hitbox.y,
                enemy.hitbox.w,
                enemy.hitbox.h
            );
        }

        // Piirrä hurtbox (magenta/pinkki)
        if (enemy.hurtbox) {
            ctx.strokeStyle = "magenta";
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.strokeRect(
                enemyScreenX + enemy.hurtbox.x,
                enemyScreenY + enemy.hurtbox.y,
                enemy.hurtbox.w,
                enemy.hurtbox.h
            );
        }

        // Piirrä vihollisen keskipiste
        ctx.fillStyle = "yellow";
        ctx.beginPath();
        ctx.arc(enemyScreenX, enemyScreenY, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
    drawDropHitboxes(ctx, drop, cameraX) {
        const dropScreenX = drop.coordinates.x - cameraX;
        const dropScreenY = drop.coordinates.y;

        ctx.save();
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 2;

        ctx.strokeRect(
            dropScreenX + drop.hitbox.x,
            dropScreenY + drop.hitbox.y,
            drop.hitbox.w * drop.scale,
            drop.hitbox.h * drop.scale
        );

        ctx.restore();
    }
}