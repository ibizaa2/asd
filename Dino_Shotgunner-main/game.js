const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');


const player = new Player();
const hud = new HUD(player);
const world = new World()
const wave = new Wave(ctx, player, world)
const debug = new Debug(player, wave);

let menuOpen = false;
let MainMenu = true


const powerups = new Powerups(0, 0, null)
let powerupList = []

const deathaudio = new Audio("./Audio/Player.death.wav")

// music
const themes = [
    new Audio("./Audio/Banger.wav"),
    new Audio("./Audio/Pablo.wav"),
    new Audio("./Audio/Mii.wav"),
    new Audio("./Audio/Npc%20music.wav"),
    new Audio("./Audio/France.wav"),
    new Audio("./Audio/Arse.wav"),
    new Audio("./Audio/Feddy.wav"),
    new Audio("./Audio/Sunshine.wav"),
    new Audio("./Audio/Shrek.wav"),
    new Audio("./Audio/Moonshine.wav"),
    new Audio("./Audio/Piracy.wav"),
    new Audio("./Audio/Slander.wav"),
]

const audioCtx = new AudioContext()

let currentIndex = 0
let currentTrack = null

function playTrack(index) {
    if (currentTrack) {
        currentTrack.pause()
        currentTrack.currentTime = 0
    }

    currentTrack = themes[index]


    currentTrack.play()

    // Vaihto
    currentTrack.onended = () => {
        currentIndex = (currentIndex + 1) % themes.length
        playTrack(currentIndex)
    }
}

startButton.addEventListener("click", () => {
playTrack(0)
})

const upgradeMenu = new UpgradeMenu(player);

const fps = 60
const frameDuration = 1000 / fps;
let lastFrameTime = 0;


function gameLoop(){

    const now = performance.now();
    if (now - lastFrameTime < frameDuration) {
        requestAnimationFrame(gameLoop);
        return;
    }
    if (MainMenu) {
        drawMenu();
        requestAnimationFrame(gameLoop);
        return;
    }
    lastFrameTime = now;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    let cameraX = player.coordinates.x + player.size / 2 - canvas.width / 2;

    if (cameraX < 0) {
        cameraX = 0;
    }

    

    world.draw(ctx, cameraX, player);
    wave.draw(ctx, cameraX);
    hud.draw(ctx);
    player.draw(ctx, cameraX);

    powerupList.forEach(powerup => {
        powerup.draw(ctx, cameraX)
        powerup.pickUp(player)
    });

    powerupList = powerupList.filter(powerup => !powerup.eaten);

      if (player.distance >= powerups.nextPowerupAt){
        powerups.spawnPowerup(player.coordinates.x, powerupList);
    }

    drops.forEach(drop => {
        drop.update(player, world, canvas)
        drop.draw(ctx, cameraX);
    });

    drops = drops.filter(drop => !drop.eaten);

    if(!upgradeMenu.isOpen && player.alive){
        player.update()
        world.update(ctx, cameraX, player);
       

         world.obstacles.forEach(obstacle =>{
        checkObjectCollision(player, obstacle, cameraX); });

    player.walk()
    player.jump()
    player.aim(cameraX)
    player.shoot()
    player.reload()
    player.eat(drops)
    player.bite()
    player.slam()
    player.glide()
    

    wave.update(ctx, player, cameraX, world)
    
    world.runMeter(player)

    checkGroundCollision(player, world, canvas, ctx);


    } else if (!player.alive) {
        if (!player.deathstart){
            player.deathstart = true;
            deathaudio.play();
            setTimeout(() => location.reload(), 3000);

        }
    } else {
        upgradeMenu.update();
    }
    
    upgradeMenu.draw(ctx);

    debug.draw(ctx, cameraX);

    requestAnimationFrame(gameLoop);
}

window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'u') { 
        upgradeMenu.isOpen = !upgradeMenu.isOpen;

        if(upgradeMenu.isOpen && menuOpen === false){
            menuOpen = true
        }

        if(!upgradeMenu.isOpen && menuOpen === true){
            menuOpen = false
        }

     
    }
});

class Star {
    constructor(canvas) {
        this.canvas = canvas;

        this.reset();
    }

    reset() {
        this.x = Math.random() * this.canvas.width;
        this.y = Math.random() * this.canvas.height;

        this.size = Math.random() * 1 + 1;
        this.speed = Math.random() * 0.1 + 0.1;
        this.alpha = Math.random() * 0.9 + 0.1;
    }

    update() {
        this.y += this.speed;

        if (this.y > this.canvas.height) {
            this.y = 0;
            this.x = Math.random() * this.canvas.width;
        }
    }

    draw(ctx) {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }
}

const stars = [];

for (let i = 0; i < 10000; i++) {
    stars.push(new Star(canvas));
}

const MenuImage = new Image();
MenuImage.src = "./Images/Menu.png";

MenuImage.onload = () => {
    gameLoop()
};

function drawMenu() {
    ctx.save()
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let star of stars) {
        star.update();
        star.draw(ctx);
    }

    ctx.fillStyle = "white";
    ctx.font = "50px Comic Sans MS";
    ctx.fillText("Dino Shotgunner", canvas.width / 2.5, canvas.height / 2.5);

    ctx.drawImage(MenuImage, canvas.width / 2.25, canvas.height / 8);

    const button = {
        x: canvas.width / 2.25, 
        y: canvas.height / 2.25,
        width: 200,
        height: 100
    }

    ctx.fillStyle = "red";
    ctx.fillRect(button.x, button.y, button.width, button.height);

    ctx.fillStyle = "white";
    ctx.font = "50px Comic Sans MS";
    ctx.fillText(
        "Play",
        button.x + button.width / 2 - 50,
        button.y + button.height / 2 + 15
    );
    ctx.restore()

    canvas.addEventListener("click", (e) => {
    if (!MainMenu) return;

    const rect = canvas.getBoundingClientRect();

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (
        mouseX >= button.x &&
        mouseX <= button.x + button.width &&
        mouseY >= button.y &&
        mouseY <= button.y + button.height
    ) {
        MainMenu = false;
    }
    
});
}
