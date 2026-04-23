const powerupimages = {
    shroom: new Image(),
    creditcard: new Image(),
    bolt: new Image(),
    lemon: new Image(),
    food: new Image(),
    shotgunshell: new Image(),


    
}

powerupimages.shroom.src = "Images/Shroom.png"
powerupimages.creditcard.src = "Images/Credit card.png"
powerupimages.bolt.src = "Images/Bolt.png"
powerupimages.lemon.src = "Images/Lemon.png"
powerupimages.food.src = "Images/Food.png"
powerupimages.shotgunshell.src = "Images/Shotgun.Shell.png"

class Powerups {

  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.nextPowerupAt = 500;
    this.scale = 0.5; 
    this.img = powerupimages[type] || new Image();


    this.width = (this.img.width || 100) * this.scale;
    this.height = (this.img.height || 100) * this.scale;

    this.eaten = false;
    this.items = ["shroom", "creditcard", "bolt", "lemon", "food", "shotgunshell"];
}

    pickUp(player){
       if (checkObjectCollision(player, this)) {
        this.applyEffect(player);
        this.eaten = true;
        return true;
    }
    return false
    }


applyEffect(player){
    switch(this.type) {
        case "lemon":
    
            player.invincibletimer = 5000;
            break
        case "shotgunshell":
          
            player.ammo = player.maxammo * 4
            break
        case"food":
      
            player.saturation = player.maxsaturation * 2
            player.hp = player.maxhp * 2

            break;
        case "shroom":
            player.shroomTimer = 300
          
            
            player.vampirism *= 1.5
            player.gluttony *= 1.5
            player.maxhp *= 1.5
            player.hp *= 1.5
            player.defence *= 1.5
            player.strenght *= 1.5
            player.maxsaturation *= 1.5
            player.luck *= 1.5
            break;
        case "creditcard":
     
            player.meat *= 1.5
            player.needles *= 1.5
            break;
        
            case "bolt":
            

            
            player.firepower *= 1.5
            player.range *= 1.5
            player.pierce *= 1.5
            player.maxammo *= 1.5
            player.loadAmount *= 1.5
            player.volume *= 1.5

            player.firerateMax *= 0.5
            player.loadMax *= 0.5
            player.spread *= 0.5
            break;
    }
}    


spawnPowerup(playerX, powerupList){

        const randomIndex = Math.floor(Math.random() * this.items.length);
        const selectedItem = this.items[randomIndex];

      
        const spawnX = playerX + 1000;
       const spawnY = (canvas.height - world.height - world.height2) - powerupimages[selectedItem].height * this.scale;

        const newPowerup = new Powerups(spawnX, spawnY, selectedItem);
        
      
        powerupList.push(newPowerup);
        this.nextPowerupAt += 500

    
}
draw(ctx, cameraX) {
        if (this.img){

        
        ctx.drawImage(
            this.img, 
            this.x - cameraX, 
            this.y, 
            this.img.width * this.scale, 
            this.img.height * this.scale
        );}
}


}
