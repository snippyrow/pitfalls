class Color3 {
    constructor(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }
}

class TextLabel {
    constructor(varName, abs_x, abs_y, Text, color, size = 12) {
        this.Name = varName;
        this.x = abs_x;
        this.y = abs_y;
        this.Text = Text;
        this.TextColor = color; // Use Color3 class
        this.TextSize = size;
    }
}

class Im {
    constructor(image) {
        this.image = image;
        this.ready = false;
    }
}

class SpriteMask {
    constructor(varName, image, pos_x, pos_y, size_x, size_y, alpha) {
        this.Name = varName;
        this.asset = image;
        this.x = pos_x;
        this.y = pos_y;
        this.size_x = size_x;
        this.size_y = size_y;
        this.alpha = alpha;
    }
}

class Player {
    constructor(varName, abs_x, abs_y, mask) {
        this.Name = varName;
        this.x = abs_x;
        this.y = abs_y;
        this.v_x = 0;
        this.v_y = 0;
        this.sprite = mask; // use SpriteMask class
        this.animation_idle = {speed: 5, frames: [{x: 0, y: 0}, {x:256, y: 0}]};
        this.animation_run = {speed: 5, frames: [{x: 0, y: 256}, {x:256, y: 256}, {x: 256 * 2, y: 256}, {x: 256 * 3, y: 256}, {x: 256 * 4, y: 256}, {x: 256 * 5, y: 256}]};
        this.animation_run_up = {speed: 5, frames: [{x: 0, y: 512}, {x:256, y: 512}, {x: 256 * 2, y: 512}, {x: 256 * 3, y: 512}]};
        this.animation_run_down = {speed: 5, frames: [{x: 0, y: 768}, {x:256, y: 768}, {x: 256 * 2, y: 768}, {x: 256 * 3, y: 768}]};
        this.animation_dead = {speed: 5, frames: [{x: 256 * 4, y: 768}, {x: 256 * 5, y: 768}, {x: 256 * 6, y: 768}]};
    }
}

class PlayerClone {
    constructor(varName, x, y, move_x, move_y, mask) {
        this.Name = varName;
        this.x = x;
        this.y = y;
        this.move_x = move_x;
        this.move_y = move_y;
        this.dead = false;
        this.sprite = mask; // use SpriteMask class
        this.animation_idle = {speed: 5, frames: [{x: 0, y: 0}, {x:256, y: 0}]};
        this.animation_run = {speed: 5, frames: [{x: 0, y: 256}, {x:256, y: 256}, {x: 256 * 2, y: 256}, {x: 256 * 3, y: 256}, {x: 256 * 4, y: 256}, {x: 256 * 5, y: 256}]};
        this.animation_run_up = {speed: 5, frames: [{x: 0, y: 512}, {x:256, y: 512}, {x: 256 * 2, y: 512}, {x: 256 * 3, y: 512}]};
        this.animation_run_down = {speed: 5, frames: [{x: 0, y: 768}, {x:256, y: 768}, {x: 256 * 2, y: 768}, {x: 256 * 3, y: 768}]};
        this.animation_dead = {speed: 5, frames: [{x: 256 * 4, y: 768}, {x: 256 * 5, y: 768}, {x: 256 * 6, y: 768}]};
    }
}

class NonPhysicsBlock {
    constructor(varName, start_x, start_y, end_x, end_y, color, alpha = 0) {
        this.Name = varName;
        this.start_x = start_x;
        this.start_y = start_y;
        this.end_x = end_x;
        this.end_y = end_y;
        this.color = color;
        this.alpha = alpha;
        this.rendered = false; // If rendered already
    }
}

class PhysicsBlock {
    constructor(varName, pos_x, pos_y, size_x, size_y, sprite) {
        this.Name = varName;
        this.x = pos_x;
        this.y = pos_y;
        this.size_x = size_x;
        this.size_y = size_y;
        this.sprite = sprite;
    }
}

class Orb {
    constructor(varName, pos_x, pos_y, sprite) {
        this.Name = varName;
        this.x = pos_x;
        this.y = pos_y;
        this.sprite = sprite;
        this.animation = {speed: 15, frames: [{x: 0, y: 0}, {x:256, y: 0}, {x: 512, y: 0}, {x: 0, y: 256}, {x: 256, y: 256}]};
    }
}