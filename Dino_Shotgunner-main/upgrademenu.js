class UpgradeMenu {
    constructor(player) {
        this.player = player;
        this.isOpen = false;

        this.currentView = "hp_list";
        this.scrollY = 0;
        
        this.width = 1000;
        this.height = 700;

        this.lihaOpen = false;
        this.neulaOpen = false;

        this.hoveredItem = null;

        this.isHolding = false;
        this.clickedThisFrame = false;
        this.justClickedHold = false;
        this.holdItem = null;
        this.holdTime = 0;
        this.holdInterval = 0;

        this.statLimits = {
            size: { min: 1, max: 4 },
            endurance: { min: 0, max: 99 },
            metabolism: { min: 10, max: Infinity },
            spread: { min: 0, max: 360 },
            range: { min: 100, max: Infinity },
            volume: { min: 1, max: Infinity },
            usage: { min: 1, max: Infinity },
            ammoCost: { min: 1, max: Infinity },
            firerateMax: { min: 1, max: Infinity },
            loadMax: { min: 1, max: Infinity },
            loadAmount: { min: 1, max: Infinity },
            firepower: { min: 1, max: Infinity }
        };

  this.upgrades = {
    liha: [
        { id: "maxhp", name: "Max HP", cost: 50, amount: 0, currency: "meat", stats: { maxhp: 1, hp: 1, size: 0.01 } },
        { id: "vitality", name: "Vitality", cost: 50, amount: 0, currency: "meat", stats: { vitality: 1, metabolism: 10 } },
        { id: "defence", name: "Defence", cost: 100, amount: 0, currency: "meat", stats: { defence: 1 } },
        { id: "agility", name: "Agility", cost: 100, amount: 0, currency: "meat", stats: { agility: 1, metabolism: 10 } },
        { id: "strength", name: "Strength", cost: 100, amount: 0, currency: "meat", stats: { strenght: 1, metabolism: 10 } },
        { id: "maxsat", name: "Max Fud", cost: 100, amount: 0, currency: "meat", stats: { maxsaturation: 1, saturation: 1, metabolism: -10 } },
        { id: "luck", name: "Luck", cost: 500, amount: 0, currency: "meat", stats: { luck: 1 } },
        { id: "endurance", name: "Endurance", cost: 1000, amount: 0, currency: "meat", stats: { endurance: 1, defence: 50 } },
        { id: "wings", name: "Wings", cost: 1500, amount: 0, currency: "meat", stats: { jumps: 1 } },
        { id: "gluttony", name: "Gluttony", cost: 2000, amount: 0, currency: "meat", stats: { gluttony: 1, metabolism: 10 } },
        { id: "vampirism", name: "Vampirism", cost: 5000, amount: 0, currency: "meat", stats: { vampirism: 1, metabolism: 10 } }
    ],
   neula: [
   
    { id: "dmg", name: "Damage", cost: 100, amount: 0, currency: "needles", stats: { firepower: 1, firerateMax: 1, spread: 10, ammoCost: 1 } },
    { id: "firerate", name: "Fire Rate", cost: 100, amount: 0, currency: "needles", stats: { firerateMax: -1, loadMax: 1 } },
    { id: "reload", name: "Quick Load", cost: 100, amount: 0, currency: "needles", stats: { loadMax: -1, loadAmount: 1 } },
    { id: "bullets", name: "Bullets", cost: 200, amount: 0, currency: "needles", stats: { volume: 4, spread: 30, usage: 1 } },
    { id: "ammo", name: "Ammo Box", cost: 300, amount: 0, currency: "needles", stats: { ammoCost: -1, maxammo: 1, loadMax: 20 } },
    { id: "range", name: "Range", cost: 300, amount: 0, currency: "needles", stats: { range: 50, firerateMax: 10 } },
    { id: "pierce", name: "Sharpness", cost: 300, amount: 0, currency: "needles", stats: { pierce: 1, firepower: 1 } },
    { id: "compression", name: "Compression", cost: 1000, amount: 0, currency: "needles", stats: { spread: -10, usage: -1, firepower: 1, range: -50 } },
    { id: "automation", name: "Automation", cost: 1000, amount: 0, currency: "needles", stats: { autoload: 1, loadMax: 100 } },
    { id: "smartammo", name: "Smart Ammo", cost: 1000, amount: 0, currency: "needles", stats: { usage: -1, ammoCost: -1, loadMax: -10, firerateMax: -10, range: 10 } },
    { id: "heftyammo", name: "Hefty Ammo", cost: 1000, amount: 0, currency: "needles", stats: { pierce: 2, firepower: 2, loadMax: 10, firerateMax: 10 } },
    { id: "inflatable", name: "Inflat. Mag", cost: 1000, amount: 0, currency: "needles", stats: { maxammo: 50 } },
    { id: "acceleration", name: "Acceleration", cost: 1500, amount: 0, currency: "needles", stats: { loadMax: -100, firerateMax: -100, loadAmount: 10 } },
    { id: "sniper", name: "Sniper gun", cost: 2500, amount: 0, currency: "needles", stats: { range: 500, firepower: 50, loadMax: 10000, ammoCost: 10 } },
    { id: "supershotgun", name: "Super gun", cost: 9999, amount: 0, currency: "needles", stats: { firepower: 2500, volume: 20, loadMax: 25000, ammoCost: 1000 } }
]
    
};  

window.addEventListener("mousemove", (e) => {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
    });

window.addEventListener("wheel", (e) => {
    if (!this.isOpen) return;

  
    this.scrollY -= e.deltaY;

 
    if (this.scrollY > 0) this.scrollY = 0;

   
    if (this.scrollY < -1000) this.scrollY = -1000; 
});

window.addEventListener("mousedown", (e) => {
    if (!this.isOpen) return;
    if (this.clickedThisFrame) return;

    const mouseX = e.clientX;
    const mouseY = e.clientY;

    const menuX = (canvas.width - this.width) / 2;
    const menuY = (canvas.height - this.height) / 2;

    const lists = [
        { arr: this.upgrades.liha, offsetX: 50 },
        { arr: this.upgrades.neula, offsetX: 550 }
    ];

    for (let l of lists) {
        for (let i = 0; i < l.arr.length; i++) {

            let itemX = menuX + l.offsetX;
            let itemY = menuY + 150 + i * 60 + this.scrollY;

            if (this.isInside(mouseX, mouseY, itemX, itemY - 20, 400, 40)) {

                this.useUpgrade(l.arr[i]);

                this.isHolding = true;
                this.holdItem = l.arr[i];
                this.holdTime = 0;
                this.holdInterval = 20;

                this.clickedThisFrame = true;
                return;
            }
        }
    }
});

window.addEventListener("mouseup", () => {
    this.isHolding = false;
    this.holdItem = null;
});
    }

    update() {
        if (!this.isHolding || !this.holdItem) return;

        this.holdTime++;
        this.holdInterval--;

        if (this.holdInterval <= 10) {
            let multiplier = Math.floor(this.holdTime / 10);
            if (multiplier < 1) multiplier = 1;

            for (let i = 0; i < multiplier; i++) {
                this.useUpgrade(this.holdItem);
            }

            let speed = Math.min(5, 1 + Math.floor(this.holdTime / 60));
            this.holdInterval = Math.max(5, 20 - speed * 3);
        }

        this.clickedThisFrame = false;
    }

    clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    useUpgrade(item){
        const currency = item.currency

        /*
        
        */ 
        if (this.player[currency] < item.cost){
            return
        }

        this.player[currency] -= item.cost
     
        item.amount++
        this.player.upgrades++

        if (item.stats) {
            for (let stat in item.stats) {
                const change = item.stats[stat];

                let current = this.player[stat] ?? 0;
                let next = current + change;

                if (this.statLimits[stat]) {
                    const { min, max } = this.statLimits[stat];
                    next = this.clamp(next, min, max);
                }

                this.player[stat] = next;
            }
        }
            
    }

    drawNeulaList(ctx, x, y){
    this.upgrades.neula.forEach((item, index) => {
        let itemY = y + 150 + index * 60 + this.scrollY;
        let itemX = x + 550;
        let itemXRight = x + 950;
       if (this.isInside(this.mouseX, this.mouseY, itemX, itemY - 20, 400, 40)){
            this.hoveredItem = item;
        }

        ctx.textAlign = "left";
        ctx.fillText(item.name, itemX, itemY);

       
        ctx.fillText("Cost: " + item.cost, x + 750, itemY)
        
        ctx.textAlign = "right";
        ctx.fillText(item.amount, itemXRight, itemY, item.cost); 
    })
    }

    drawLihaList(ctx, x, y) {
    this.upgrades.liha.forEach((item, index) => {
        let itemY = y + 150 + index * 60 + this.scrollY;
     

        if (this.isInside(this.mouseX, this.mouseY, x + 50, itemY - 20, 400, 40)){
            this.hoveredItem = item;
            
        
        }
      
        
        
        ctx.textAlign = "left";
        ctx.fillText(item.name, x + 50, itemY);

        ctx.fillText("Cost: " + item.cost, x + 250, itemY)
        
        ctx.textAlign = "right";
        ctx.fillText(item.amount, x + 450, itemY); 
    });
}

    isInside(pointX, pointY, boxX, boxY, width, height) {
    const vasenReuna = boxX;
    const oikeaReuna = boxX + width;
    const yläReuna = boxY;
    const alaReuna = boxY + height;

    // Tarkistetaan onko kursori boksin sisällä
    return pointX >= vasenReuna && pointX <= oikeaReuna &&
           pointY >= yläReuna && pointY <= alaReuna;
}

drawTooltip(ctx) {
        const item = this.hoveredItem;
        if (!item) return;

        ctx.save()
        const mouseXx = this.mouseX + 15
        const mouseYy = this.mouseY + 15
        const boxW = 340
        
        let statsCount = 0
        for (let s in item.stats){
            statsCount++
        } 
        const boxH = statsCount * 30 + 20

        ctx.fillStyle = "rgba(0, 0, 0, 0.95)";
        ctx.fillRect(mouseXx, mouseYy, boxW, boxH);
        ctx.strokeStyle = "white";
        ctx.strokeRect(mouseXx, mouseYy, boxW, boxH);

        ctx.font = "14px arial";
        ctx.textAlign = "left";

        const positiveGoodStats = ["size", "maxammo", "vampirism","firepower", "volume", "range", "pierce", "maxhp", "hp", "vitality", "defence", "agility", "strenght", "luck", "endurance", "jumps", "gluttony", "vampirism", "loadAmount", "autoload", "maxsaturation", "saturation"];
        const NegativeGoodStats = ["metabolism", "firerateMax", "loadMax", "spread", "usage", "ammoCost"]
        let row = 0;
        for (let stat in item.stats) {
            const change = item.stats[stat]
            const current = this.player[stat]
            const next = current + change;

         
            let color;
            if (positiveGoodStats.includes(stat)) {
                if (change > 0) {
                    color = "#aaffaa";
                } else {
                    color = "#ffaaaa"; 
                }
            } else if (NegativeGoodStats.includes(stat)) {
                if (change < 0) {
                    color = "#aaffaa"; 
                } else {
                    color = "#ffaaaa";
                }
            }
            
            ctx.fillStyle = color;
           
           
     

    let text = stat + ": " + current + " -> " + next;


    let textX = mouseXx + 15;
    let textY = mouseYy + 30 + (row * 25);

    ctx.fillText(text, textX, textY);

    row++
        }
        ctx.restore();
    }
drawMainMenu(ctx, x, y){
    ctx.fillStyle = "darkred";
    ctx.fillRect(x, y, this.width / 2, this.height);

    ctx.fillStyle = "darkgreen";

    ctx.fillRect(x + this.width / 2, y, this.width / 2, this.height);


    ctx.beginPath();
    ctx.moveTo(x + this.width / 2, y); 
    ctx.lineTo(x + this.width / 2, y + this.height);

    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x + this.width / 2, y - 100); 

    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.moveTo(x, y + 100); 

    ctx.lineTo(x + this.width, y + 100); 

    ctx.fillStyle = "black";
    ctx.font = "bold 30px arial";
    

   
    
    
    ctx.textAlign = "left"; 
    ctx.fillText("Liha: " + Math.floor(this.player.meat), x + this.width * 0.25, y + 60);

    ctx.stroke();
    ctx.textAlign = "left";
    ctx.fillText("Neula: " + Math.floor(this.player.needles), x + this.width * 0.75, y + 60);





    
    if (this.currentView === "regular"){
         ctx.stroke();
    ctx.fillText("boolet", x + this.width * 0.75, y + 180 );
    ctx.fillStyle = "black";
        ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.strokeRect(x + this.width * 0.77 + 50, y + 150, 40, 40);
    ctx.fillText("+", x + this.width * 0.77 + 70, y + 180);

    ctx.stroke();
    ctx.fillText("hp", x + this.width * 0.25, y + 180 );
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.strokeRect(x + this.width * 0.25 + 50, y + 150, 40, 40);



    ctx.fillText("+", x + this.width * 0.25 + 70, y + 180);
    ctx.fillStyle = "black";
    }
}    

draw(ctx) {
    if (!this.isOpen) return;
    ctx.save();

    const x = (ctx.canvas.width - 1000) / 2; 
    const y = (ctx.canvas.height - 700) / 2;

    this.drawMainMenu(ctx, x, y);
    this.hoveredItem = null;

    if (this.currentView === "hp_list"){
        ctx.beginPath();
        ctx.rect(x, y + 100, this.width, this.height - 100); 
        ctx.clip();


        this.drawLihaList(ctx, x, y);
        this.drawNeulaList(ctx, x, y);
    }

    if(this.hoveredItem){
        this.drawTooltip(ctx);
    }
    

    
    ctx.restore();

}

   

}
