
// Full-page high-DPI-aware rootCanvas with resize handling
const rootCanvas = document.getElementById('canvas');
const ctx = rootCanvas.getContext('2d');


function resizeRootCanvas() {
    const dpr = window.devicePixelRatio || 1;

    rootCanvas.style.width = window.innerWidth + 'px';
    rootCanvas.style.height = window.innerHeight + 'px';

    rootCanvas.width = Math.floor(window.innerWidth * dpr);
    rootCanvas.height = Math.floor(window.innerHeight * dpr);

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

var gameFolder = [];
var imageAssets = [];
let keys = {};


function renderText(abs_x, abs_y, label, color, size, font = "'Courier New', monospace") {
    ctx.font = `${size}px ${font}`;
    ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`; 
    ctx.fillText(label, abs_x, abs_y);
}

function findObject(searchTerm, className) {
    for (var o = 0; o<gameFolder.length; o++) {
        object = gameFolder[o];
        if (object instanceof className && object.Name == searchTerm) {
            return object;
        }
    }
}

function loadImage(url) {
    var newIm = new Im(new Image);
    newIm.image.src = url;
    imageAssets.push(newIm);
    newIm.image.onload = function() {
        newIm.ready = true;
    }
    return newIm;
}


// Example animation that adapts to size
let dt = 0;
var hole;
var dead = false;
var plrSprite;
var cloneNum = 0;

var holes = []; // populate with x and y

function drawCircle(ctx, x, y, radius, color = "red") {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
}

function clone() {
    const w = rootCanvas.width / (window.devicePixelRatio || 1);
    const h = rootCanvas.height / (window.devicePixelRatio || 1);
    // Clone player, make it walk
    var plr = findObject("PlayerMain", Player);
    if (cloneNum <= 0) {
        dead = true;
        setTimeout(re, 3000);
        return;
    } else {
        cloneNum --;
    }
    var move_x;
    var move_y;
    if (keys["d"]) {
        move_x = -1;
    } else if (keys["a"]) {
        move_x = 1;
    } else if (keys["w"]) {
        move_y = 1;
    } else if (keys["s"]) {
        move_y = -1;
    }
    gameFolder.push(new PlayerClone("Clone",-plr.x + (w/2) - 75,-plr.y + (h/2) - 75,move_x,move_y,plrSprite));
}

function re() {
    location.reload();
}
let alpha = 0;
function draw() {
    const w = rootCanvas.width / (window.devicePixelRatio || 1);
    const h = rootCanvas.height / (window.devicePixelRatio || 1);

    // Clear canvas
    ctx.clearRect(0, 0, w, h);

    // Draw grid
    ctx.fillStyle = "#068522ff";
    var plr = findObject("PlayerMain", Player);
    var coords = {x: plr.x, y: plr.y};
    for (var x = 0; x < w/64; x++) ctx.fillRect(x*64 + coords.x % 64, 0, 4, h);
    for (var y = 0; y < h/64; y++) ctx.fillRect(0, y*64 + coords.y % 64, w, 4);

    const MIN_HOLE_DISTANCE = 220; // pixels

    for (let x = Math.round((coords.x - w) / 64); x < Math.round((coords.x + w) / 64); x++) {
        for (let y = Math.round((coords.y - h) / 64); y < Math.round((coords.y + h) / 64); y++) {
            
            let posX = -x * 64;
            let posY = -y * 64;

            if (!holes.some(c => c.x === posX && c.y === posY)) {
                // Distance from origin
                let dist = Math.sqrt(posX * posX + posY * posY);

                // Probability grows with distance (max 50%)
                let probability = Math.min(0.05 + dist / 50000, 0.1);

                if (Math.random() < probability) {
                    // Check if new hole is too close to existing ones
                    let tooClose = holes.some(c => {
                        let dx = c.x - posX;
                        let dy = c.y - posY;
                        return Math.sqrt(dx * dx + dy * dy) < MIN_HOLE_DISTANCE;
                    });

                    if (!tooClose) {
                        holes.push({ x: posX, y: posY });
                        gameFolder.push(new PhysicsBlock("Hole", posX, posY, 256, 256, hole));
                    }
                }
            }
        }
    }

    // Draw only physics
for (let o = 0; o < gameFolder.length; o++) {
    const object = gameFolder[o];
    if (object instanceof PhysicsBlock) {
        if (object.sprite.asset.ready) {
            // Convert world → screen coordinates
            const screenX = object.x + coords.x;
            const screenY = object.y + coords.y;

            // Draw sprite
            ctx.drawImage(object.sprite.asset.image, screenX, screenY, 256, 256);

            // Hole center in world space
            const holeX = object.x + 128; 
            const holeY = object.y + 128; 

            // Player in world space
            const plrX = -coords.x + (w / 2);  
            const plrY = -coords.y + (h / 2);  

            // Convert both to screen space for drawing circles
            //drawCircle(ctx, holeX + coords.x, holeY + coords.y, 64, "red"); 
            //drawCircle(ctx, plrX + coords.x + (w / 2), plrY + coords.y + (h / 2), 16, "green");

            // Collision check in world space
            const dist = Math.sqrt((plrX - holeX) ** 2 + (plrY - holeY) ** 2);
            if (dist < 64) {
                dead = true;
                setTimeout(re, 3000);
            }

            // Kill any clones near the hole
            var clone;
            for (let c = 0; c < gameFolder.length; c++) {
                clone = gameFolder[c];
                if (clone instanceof PlayerClone) {
                    // Collision check in world space
                    const dist = Math.sqrt(((clone.x - 75) - object.x) ** 2 + ((clone.y - 75) - object.y) ** 2);
                    if (dist < 64) {
                       clone.dead = true;
                       gameFolder.splice(o, 1);
                    }
                }
            }
        }
    }
}

    // Draw objects
    for (var o = 0; o < gameFolder.length; o++) {
        const object = gameFolder[o];
        if (object instanceof TextLabel) {
            renderText(object.x, object.y, object.Text, object.TextColor, object.TextSize);
        } else if (object instanceof SpriteMask && object.asset.ready) {
            ctx.drawImage(object.asset.image, object.x, object.y, object.size_x, object.size_y);
        } else if (object instanceof Player) {
            if (object.sprite.asset.ready) {
                if (dead) {
                    var frame_id = Math.round(dt / 5) % object.animation_dead.frames.length;
                    var frame = object.animation_dead.frames[frame_id];
                    ctx.drawImage(object.sprite.asset.image, frame.x, frame.y, 256, 256, w/2-(75), h/2-(75), 150, 150);

                    
                } else {
                    if (keys["a"]) {
                        if (dt % 100 == 0) {
                            cloneNum ++;
                        }
                        object.x += 6;
                        var frame_id = Math.round(dt / 5) % object.animation_run.frames.length;
                        var frame = object.animation_run.frames[frame_id];
                        ctx.drawImage(object.sprite.asset.image, frame.x, frame.y, 256, 256, w/2-(75), h/2-(75), 150, 150);
                    } else if (keys["d"]) {
                        if (dt % 100 == 0) {
                            cloneNum ++;
                        }
                        object.x -= 6;
                        var frame_id = Math.round(dt / 5) % object.animation_run.frames.length;
                        var frame = object.animation_run.frames[frame_id];
                        ctx.save();

                        // More steps to flip it right
                        const drawX = w/2 - 75;
                        const drawY = h/2 - 75;
                        const drawWidth = 150;
                        const drawHeight = 150;

                        ctx.translate(drawX + drawWidth / 2, drawY + drawHeight / 2);
                        ctx.scale(-1, 1); // flip horizontally

                        // Draw the image centered at the flipped origin
                        ctx.drawImage(object.sprite.asset.image, frame.x, frame.y, 256, 256, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);

                        ctx.restore();
                    } else if (keys["w"]) {
                        if (dt % 100 == 0) {
                            cloneNum ++;
                        }
                        object.y += 6;
                        var frame_id = Math.round(dt / 5) % object.animation_run_up.frames.length;
                        var frame = object.animation_run_up.frames[frame_id];
                        ctx.drawImage(object.sprite.asset.image, frame.x, frame.y, 256, 256, w/2-(75), h/2-(75), 150, 150);
                    } else if (keys["s"]) {
                        if (dt % 100 == 0) {
                            cloneNum ++;
                        }
                        object.y -= 6;
                        var frame_id = Math.round(dt / 5) % object.animation_run_down.frames.length;
                        var frame = object.animation_run_down.frames[frame_id];
                        ctx.drawImage(object.sprite.asset.image, frame.x, frame.y, 256, 256, w/2-(75), h/2-(75), 150, 150);
                    } else {
                        var frame_id = Math.round(dt / 5) % object.animation_idle.frames.length;
                        var frame = object.animation_idle.frames[frame_id];
                        ctx.drawImage(object.sprite.asset.image, frame.x, frame.y, 256, 256, w/2-(75), h/2-(75), 150, 150);
                    }
                }
            }
        } else if (object instanceof PlayerClone) {
            if (object.dead) {
                var frame_id = Math.round(dt / 5) % object.animation_dead.frames.length;
                var frame = object.animation_dead.frames[frame_id];
                ctx.drawImage(object.sprite.asset.image, frame.x, frame.y, 256, 256, object.x + coords.x, object.y + coords.y, 150, 150);
            } else {
                if (object.move_x == 1) {
                    object.x -= 10;
                    var frame_id = Math.round(dt / 5) % object.animation_run.frames.length;
                    var frame = object.animation_run.frames[frame_id];
                    ctx.drawImage(object.sprite.asset.image, frame.x, frame.y, 256, 256, object.x + coords.x, object.y + coords.y, 150, 150);
                } else if (object.move_x == -1) {
                    object.x += 10;
                    var frame_id = Math.round(dt / 5) % object.animation_run.frames.length;
                    var frame = object.animation_run.frames[frame_id];

                    ctx.save();

                    const drawX = object.x + coords.x; // world X + camera
                    const drawY = object.y + coords.y; // world Y + camera
                    const drawWidth = 150;
                    const drawHeight = 150;

                        // Move origin to object's center
                    ctx.translate(drawX + drawWidth / 2, drawY + drawHeight / 2);
                    ctx.scale(-1, 1); // flip horizontally

                        // Draw centered relative to flipped origin
                    ctx.drawImage(object.sprite.asset.image, frame.x, frame.y, 256, 256, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);

                    ctx.restore();

                } else if (object.move_y == 1) {
                    object.y -= 10;
                    var frame_id = Math.round(dt / 5) % object.animation_run_up.frames.length;
                    var frame = object.animation_run_up.frames[frame_id];
                    ctx.drawImage(object.sprite.asset.image, frame.x, frame.y, 256, 256, object.x + coords.x, object.y + coords.y, 150, 150);
                } else if (object.move_y == -1) {
                    object.y += 10;
                    var frame_id = Math.round(dt / 5) % object.animation_run_down.frames.length;
                    var frame = object.animation_run_down.frames[frame_id];
                    ctx.drawImage(object.sprite.asset.image, frame.x, frame.y, 256, 256, object.x + coords.x, object.y + coords.y, 150, 150);
                }
            }
        }
    }

    dt++;
    findObject("FrameCounter", TextLabel).Text = `${cloneNum.toString()} clone(s) left. Walk to get more.`;
    if (dead) {
        ctx.fillStyle = "rgba(0,0,0," + alpha + ")";
        ctx.fillRect(0, 0, w, h);

        ctx.font = "100px Pricedown, sans-serif";
        ctx.fillStyle = "rgba(255,0,0," + alpha + ")";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Wasted.", w / 2, h / 2);
        alpha+=0.01;
    }
    requestAnimationFrame(draw);
}



function init() {
    gameFolder.push(new TextLabel("FrameCounter", 50, 60, "0", new Color3(255, 255, 255), 30));
    var playerAsset = loadImage("Assets/sprites_all.png");
    var holeAsset = loadImage("Assets/hole.png");
    var playerSprite = new SpriteMask("PlayerSpritesheet", playerAsset, 100, 100, 200, 200, 0);
    plrSprite = playerSprite;
    var holeSprite = new SpriteMask("Hole", holeAsset, 200, 200, 200, 200, 0);
    hole = holeSprite;
    //gameFolder.push(playerSprite);
    var player = new Player("PlayerMain", 0, 0, playerSprite);
    var physicsHole = new PhysicsBlock("Hole", 100,100,256,256,hole);
    gameFolder.push(player);

    //gameFolder.push(new NonPhysicsBlock("Block1", 300, 600, 700, 650, new Color3(255,0,255), 0));
    //gameFolder.push(new NonPhysicsBlock("Block2", 700,100,750,700, new Color3(255,255,255)))

    // Load player

}

window.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
        clone();
        event.preventDefault(); // Optional: prevent scrolling
    }
});

// Key event listeners
window.addEventListener("keyup", (a) => {
  keys[a.key] = false;
});

window.addEventListener("keydown", (a) => {
    keys[a.key] = true;
});

window.addEventListener("keyup", (d) => {
  keys[d.key] = false;
});

window.addEventListener("keydown", (d) => {
  keys[d.key] = true;
});

init();

// Initialize
window.addEventListener('resize', resizeRootCanvas, {passive: true});
resizeRootCanvas();
requestAnimationFrame(draw);


// Optional: expose rootCanvas for debugging
window.__FULLPAGE_rootCanvas__ = rootCanvas;
