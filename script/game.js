var canvas = null;
var img = null;
var ctx = null;
var imageReady = false;
var playerKen = null;
var isCollision = false;

var mapCollisionObjects = [];

var requestAnimFrame = (function() {
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function( callback ) {
                window.setTimeout(callback, 1000 / 60);
            };
})();

function fillAnimFrames(animJsonFrames, nameForArr) {
    for (var i = 0; i < animJsonFrames.frames.length; i++) {
        createAnim(nameForArr, animJsonFrames, i);
    }
}

function createAnim(animName, animJsonFrames, i) {
    animName.push({
        sx: animJsonFrames.frames[i].frame.x,
        sy: animJsonFrames.frames[i].frame.y,
        sw: animJsonFrames.frames[i].frame.w,
        sh: animJsonFrames.frames[i].frame.h,
        dx: animJsonFrames.frames[i].spriteSourceSize.x,
        dy: animJsonFrames.frames[i].spriteSourceSize.y,
        dw: animJsonFrames.frames[i].spriteSourceSize.w,
        dh: animJsonFrames.frames[i].spriteSourceSize.h
    });
}

function Map() {
    this.collisionObj = [];
}

Map.prototype.getColObjPos = function() {
    for (var i = 0; i < map.layers[3].objects.length; i++) {
        mapCollisionObjects.push({
        x: map.layers[3].objects[i].x,
        y: map.layers[3].objects[i].y,
        w: map.layers[3].objects[i].width,
        h: map.layers[3].objects[i].height,
        name: map.layers[3].objects[i].name,
        type: map.layers[3].objects[i].type,
        properties: map.layers[3].objects[i].properties
    });
    }
}   

function Player() {

    this.dx = 20;
    this.dy = 210;
    this.playerWidth = 35;
    this.playerHeight = 70;

    this.isKeyPressed = false;
    this.isSpacebar = false;
    this.isKeyRight = false;
    this.isKeyLeft = false;
    this.isKeyUp = false;
    this.isKeyDown = false;
    this.isKeyZ = false;
    this.speed = 2;
    this.frameLength = 0;
    this.stopOtherAnim = 0;

    this.createAnimationFrames();
    this.currentFrames = this.framesKenStand;
}

Player.prototype.createAnimationFrames = function() {
    this.framesKenStand = [];
    this.framesKenMove = [];
    this.framesKenPuch = [];
    this.framesKenJump = [];

    this.spritesFrames = [this.framesKenStand, this.framesKenMove, this.framesKenPuch, this.framesKenJump];
    this.spriteNames = [kenStand, kenMove, kenPunch, kenJump];

    for (var i = 0; i < this.spriteNames.length; i++) {
        fillAnimFrames(this.spriteNames[i], this.spritesFrames[i]);
    }
}

Player.prototype.directions = function() {

    if (this.isKeyPressed) {

        if (this.isSpacebar) {
            this.currentFrames = this.framesKenJump;
            msPerFrame = 60;
            this.stopOtherAnim = 20;
            this.dy -= 6;
        } 
        if (this.isKeyZ) {
            this.currentFrames = this.framesKenPuch;
            msPerFrame = 40;
            console.log("test");
            this.stopOtherAnim = 12;
        }

        if (this.isKeyRight && this.stopOtherAnim == 0) {
            this.dx += this.speed;
            this.currentFrames = this.framesKenMove;
            msPerFrame = 50;
        }
        if (this.isKeyLeft && this.stopOtherAnim == 0) {
            this.dx -= this.speed;
            this.currentFrames = this.framesKenMove;
            msPerFrame = 50;
        }  
        if (this.isKeyUp && this.stopOtherAnim == 0) {
            this.dy -= this.speed;
            this.currentFrames = this.framesKenMove;
            msPerFrame = 50;
        } 
        if (this.isKeyDown && this.stopOtherAnim == 0) {
            this.dy += this.speed;
            this.currentFrames = this.framesKenMove;
            msPerFrame = 50;
        }
    }

    if (this.stopOtherAnim == 0 && !this.isSpacebar && !this.isKeyDown 
        && !this.isKeyUp && !this.isKeyLeft && !this.isKeyRight) {
        msPerFrame = 80;
        this.currentFrames = this.framesKenStand;
    }

    if (this.stopOtherAnim > 0) {
        this.stopOtherAnim --;
    }
    this.frameLength = this.currentFrames.length;
}

Player.prototype.getCurrentFrames = function() {
    return this.currentFrames;
}

Player.prototype.collision = function() {
    for (var i = 0; i < mapCollisionObjects.length; i++) {

        if ((this.dx + this.playerWidth >= mapCollisionObjects[i].x && 
            this.dx <= (mapCollisionObjects[i].x + mapCollisionObjects[i].w)) && 
            ((this.dy + this.playerHeight >= mapCollisionObjects[i].y) && 
            this.dy + this.playerHeight <= (mapCollisionObjects[i].y + mapCollisionObjects[i].h))) {

            if (this.isKeyRight && this.dx + this.playerWidth >= mapCollisionObjects[i].x) {
                console.log("in Right");
                this.isKeyRight = false;
                return this.dx -= 3;
            }  
            if (this.isKeyLeft && this.dx <= (mapCollisionObjects[i].x + mapCollisionObjects[i].w)) {
                console.log("in Left");
                this.isKeyLeft = false;
                return this.dx += 3;
            }  
            if (this.isKeyUp && this.dy + this.playerHeight >= mapCollisionObjects[i].y) {
                console.log("in Up");
                this.isKeyUp = false;
                return this.dy += 3;
            }  
            if (this.isKeyDown && this.dy + this.playerHeight <= (mapCollisionObjects[i].y + mapCollisionObjects[i].h)) {
                console.log("in Down");
                this.isKeyDown = false;
                return this.dy -= 3;
            }   
            
            isCollision = true;
            console.log("check");

        }
    }
    //console.log(map.layers[3].object[1]);
}

function onload() {
    canvas = document.getElementById('player-canvas');
    ctx = canvas.getContext("2d");
    img = new Image();
    img.src = 'images/sprites/ken3.png';

    playerKen = new Player();
    gameMap = new Map();
    gameMap.getColObjPos();
    console.log(mapCollisionObjects);
    img.onload = loaded();

    redraw();
    window.addEventListener("keydown", checkKeyDown, false);
    window.addEventListener("keyup", checkKeyUp, false);
}

function loaded() {
    imageReady = true;
    update();
}

var xMove = 0;

function redraw() {
    ctx.clearRect(0,0, canvas.width, canvas.height);
    if (imageReady) {
        ctx.drawImage(img, playerKen.currentFrames[frame].sx, playerKen.currentFrames[frame].sy, 
                        playerKen.currentFrames[frame].sw, playerKen.currentFrames[frame].sh,
                        playerKen.dx, playerKen.dy, 
                        playerKen.currentFrames[frame].dw, playerKen.currentFrames[frame].dh);
    }
}

var frame = 0;
var lastUpdateTime = 0;
var acDelta = 0;
var msPerFrame = 80;

function update() {
    requestAnimFrame(update);
    playerKen.getCurrentFrames();
    playerKen.collision();
    playerKen.directions();
    

    var delta = Date.now() - lastUpdateTime;
    if (acDelta > msPerFrame)
    {
        acDelta = 0;
        frame++;
        if (frame >= playerKen.frameLength) frame = 0;
        redraw();
    } else {
        acDelta += delta;
    }

    lastUpdateTime = Date.now();
}


function checkKeyDown(e) {
    var keyID = e.keyCode || e.which;
    playerKen.isKeyPressed = true;
    // Up or W key
    if (keyID === 38 || keyID === 87) {
        playerKen.isKeyUp = true;
        e.preventDefault();
    }
    // Right or D key
    if (keyID === 39 || keyID === 68) {
        playerKen.isKeyRight = true;
        e.preventDefault();
    }
    // Down or S key
    if (keyID === 40 || keyID === 83) {
        playerKen.isKeyDown = true;
        e.preventDefault();
    }
    // Left or A key
    if (keyID === 37 || keyID === 65) {
        playerKen.isKeyLeft = true;
        e.preventDefault();
    }
    // Z key
    if (keyID === 90) {
        playerKen.isKeyZ = true;
        e.preventDefault();
    }
    // Space
    if (keyID == 32) {
        playerKen.isSpacebar = true;
        e.preventDefault();
    }
}

function checkKeyUp(e) {
    var keyID = e.keyCode || e.which;
    if (!keyID) {
        playerKen.isKeyPressed = false;
    };
    
    // Up or W key
    if (keyID === 38 || keyID === 87) {
        playerKen.isKeyUp = false;
        e.preventDefault();
    }
    // Right or D key
    if (keyID === 39 || keyID === 68) {  
        playerKen.isKeyRight = false;
        e.preventDefault();
    }
    // Down or S key
    if (keyID === 40 || keyID === 83) {
        playerKen.isKeyDown = false;
        e.preventDefault();
    }
    // Left or A key
    if (keyID === 37 || keyID === 65) {
        playerKen.isKeyLeft = false;
        e.preventDefault();
    }
    // Z key
    if (keyID === 90) {
        playerKen.isKeyZ = false;
        e.preventDefault();
    }
    // Space
    if (keyID == 32) {
        playerKen.isSpacebar = false;
        e.preventDefault();
    }
}

onload();