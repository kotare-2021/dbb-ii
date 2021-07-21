import { Ball, Block, Dash, Idle, Hop } from "./stances/Stances";

const DEFAULT_SPEED = 250;
const BALL_SPEED = 500;
const PLAYER_DRAG_X = 700;
const ARENA_WIDTH = 1280; // this should not be hard coded here!
const ARENA_HEIGHT = 720; // neither should this!

// milliseconds between dash use
const DASH_COOLDOWN = 5000;

const HOP_SPEED = 1e3;
const DASH_SPEED = 800;

let ControlScheme = {
  HOP: "B0",
  DASH: "B5",
  BLOCK: "B4",
  BALL: "B2",
  dir: "AIM",
};

export const Stances = Object.freeze({
  DASH: "DASH",
  BLOCK: "BLOCK",
  BALL: "BALL",
  IDLE: "IDLE",
});

export default class Fighter extends Phaser.GameObjects.Sprite {
  constructor(arena, x, y, controlScheme = ControlScheme) {
    // do what a sprite does with a scene,
    // except here we called it 'arena' instead.
    super(arena, x, y);

    this.spawn = { x, y };

    // Ensure correct sprite size
    this.setScale(0.1);

    // Initialize fighter with default stance
    this.setStance(Stances.IDLE);

    // TODO: Get x, y values from tiled map
    this.setPosition(x, y);

    // copy control scheme from defaults
    this.controlScheme = {};
    for (let [key, value] of Object.entries(ControlScheme)) {
      this.controlScheme[key] = value;
    }
    this.mass = 50;
  }

  update(input) {
    // Default physics properties
    this.body.setDrag(PLAYER_DRAG_X, 0);

    // Get inputs (this frame)
    let { direction, buttons } = input;
    let { UP, DOWN, LEFT, RIGHT } = direction;

    // Get movement direction from left stick
    let dx = Number(RIGHT) - Number(LEFT);
    let dy = Number(DOWN) - Number(UP);
    let angle = Math.atan2(dy, dx);

    // Handle button presses
    let { HOP, BALL, BLOCK, DASH } = this.controlScheme;

    if (buttons[HOP]) {
      if (this.state === Stances.IDLE) {
        Hop(this, { vx: dx * HOP_SPEED, vy: dy * HOP_SPEED });
        this.state = "JUMPED";
      }
    } else if (buttons[BALL]) {
      Ball(this, { ax: dx * BALL_SPEED, ay: BALL_SPEED / 3 });
    } else if (buttons[BLOCK]) {
      Block(this, { vx: 0, vy: 0 });
      this.body.stop();
    } else if (buttons[DASH] && dx + dy) {
      Dash(this, { vx: dx * DASH_SPEED, vy: dy * DASH_SPEED });
      this.dashCooldown(this);
    } else {
      this.body.setAllowGravity(true);
      if (this.state === Stances.DASH) {
        setTimeout(() => {
          Idle(this, { vx: dx * DEFAULT_SPEED });
          return;
        }, 500);
      } else {
        Idle(this, { vx: dx * DEFAULT_SPEED });
      }
    }
    
    // All stance sprites face the direction
    // of the left thumbstick
    // this.updateHitbox()
    // this.setRotation(angle)
    // When you get to the arena edge,
    // wrap back around.
    if (this.state !== Stances.DASH) this.setFlipX(this.LEFT > 0)
    this.y = modulo(this.y, ARENA_HEIGHT)
    this.x = modulo(this.x, ARENA_WIDTH)
    
    // move glow
    this.glow.setPosition(this.x, this.y);
  }

  setStance(stanceName) {
    if (!Object.values(Stances).includes(stanceName)) {
      throw new Error(`Stance ${stanceName} must be a defined stance.`);
    }
    this.state = stanceName;
  }

  // updateHitbox updates the fighter's
  // hitbox based on its sprite width
  updateHitbox() {
    // Change the hitbox to a circle
    const halfWidth = this.width / 2;
    const shrinkHitboxByAmount = 40;
    const hitBoxRadius = halfWidth - shrinkHitboxByAmount;
    this.body.setCircle(hitBoxRadius);
  }

  dashCooldown(player) {
    player.controlScheme.DASH = "B7";
    setTimeout(() => {
      player.controlScheme.DASH = "B5";
    }, 500);
  }
}

// *** HELPERS ***

function modulo(k, n) {
  return (n + (k % n)) % n;
}
