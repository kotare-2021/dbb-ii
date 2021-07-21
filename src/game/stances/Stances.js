// import { Stances } from "../Fighter"
const Stances = {
  DASH: "DASH",
  BLOCK: "BLOCK",
  BALL: "BALL",
  IDLE: "IDLE",
};

const IDLE_WIDTH = 605;
const IDLE_HEIGHT = 580;
const IDLE_DRAG = 80;
const IDLE_SCALE = 0.1;
const IDLE_SPEED = 550;
const BALL_MAX_SPEED = 850;
const BALL_BOUNCE = 1.2;
const SHRINK_HITBOX_BY_AMOUNT = 40;
const HOP_SPEED = 10000;
const HOPPER_MAX_SPEED = 800;
const NO_BOUNCE = 0;
const NO_DRAG = [0, 0];
const DASH_MAX_SPEED = 800;
const DASH_GRAVITY = 50;
const HOP_MAX_SPEED = 500;
const EMIT_TRAIL = true;
const PAUSE_TRAIL = false;

function Stance(name, canMove, bounce, dragVector, maxSpeed, canEmit, gravity) {
  return function stanceUpdater(sprite, { vx, vy, ax, ay }) {
    sprite.setStance(name);

    let { body } = sprite;
    body.moves = canMove;
    body.setBounce(bounce);
    body.setDrag(dragVector[0], dragVector[1]);
    body.setMaxSpeed(maxSpeed);
    sprite.trail.active = canEmit;
    // body.gravity.y(gravity)

    // if block stance, freeze in place
    if (sprite.state === Stances.BLOCK) {
      body.stop();
      body.setAllowGravity(false);
    }
    if (vx) body.setVelocityX(vx);
    if (vy) body.setVelocityY(vy);
    if (ax != null && ay != null) {
      body.setAcceleration(ax, ay);
    } else {
      body.setAcceleration(0, 0);
    }
  };
}

// Default state
export const Idle = Stance(
  Stances.IDLE,
  true,
  NO_BOUNCE,
  [IDLE_DRAG, 0],
  IDLE_SPEED,
  PAUSE_TRAIL
);

// Hop (looks the same as idle),
export const Hop = Stance(
  Stances.IDLE,
  true,
  NO_BOUNCE,
  // NO_DRAG,
  [IDLE_DRAG, 0],
  HOP_MAX_SPEED,
  EMIT_TRAIL
);

// Ball
export const Ball = Stance(
  Stances.BALL,
  true,
  BALL_BOUNCE,
  NO_DRAG,
  BALL_MAX_SPEED,
  EMIT_TRAIL
);

// Block
export const Block = Stance(
  Stances.BLOCK,
  false, //block can't move
  NO_BOUNCE,
  NO_DRAG,
  0,
  PAUSE_TRAIL
);

// Dash
export const Dash = Stance(
  Stances.DASH,
  true,
  NO_BOUNCE,
  NO_DRAG,
  DASH_MAX_SPEED,
  EMIT_TRAIL,
  DASH_GRAVITY
);
