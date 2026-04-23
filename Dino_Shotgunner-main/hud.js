class HUD {
    constructor(player){
        this.player = player;

      
        this.hpImage = new Image();
        this.hpImage.src = 'Images/hp.png';

        this.hungerImage = new Image();
        this.hungerImage.src = 'Images/hunger.png';

        this.ammoImage = new Image();
        this.ammoImage.src = 'Images/ammo.png';

        this.needlesImage = new Image();
        this.needlesImage.src = 'Images/needles.png';

        this.saturationImage = new Image();
        this.saturationImage.src = 'Images/saturation.png';

        this.upgradesImage = new Image();
        this.upgradesImage.src = 'Images/upgrades.png';
    }

    draw(ctx){

        const width = ctx.canvas.width;
        const rightcorner = width - 70;

        

        ctx.drawImage(this.hpImage, 20, 20)
        ctx.fillText(this.player.hp.toFixed(0) + "/" + this.player.maxhp.toFixed(0), 60, 50);

        //ctx.drawImage(this.hungerImage, 20, 60)
        //ctx.fillText(this.player.hunger, 60, 90);

        ctx.drawImage(this.ammoImage, 20, 60);
        ctx.fillText(this.player.ammo.toFixed(0) + "/" + this.player.maxammo.toFixed(0), 60, 90);

        //ctx.drawImage(this.needlesImage, 20, 140);
        //ctx.fillText(this.player.needles, 60, 170);

        ctx.drawImage(this.saturationImage, 20, 100);
        ctx.fillText(this.player.saturation.toFixed(0) + "/" + this.player.maxsaturation.toFixed(0), 60, 130);

        ctx.drawImage(this.upgradesImage, rightcorner, 20);
        ctx.fillText(this.player.upgrades, rightcorner + 40, 50);

        ctx.fillText('Distance: ' + this.player.distance + 'm', rightcorner - 5, 80);

    
}
}

    
