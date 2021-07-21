import { Stances } from "../fighter";

const BALL_MAX_SPEED = 850;
const BALL_BOUNCE = 1.2;
const SHRINK_HITBOX_BY_AMOUNT = 40;

function Ball() {
  this.setStance(Stances.BALL);

  // Change the hitbox to a circle
  const spriteRadius = this.width / 2;
  const hitBoxRadius = spriteRadius - SHRINK_HITBOX_BY_AMOUNT;
  this.body.setCircle(hitBoxRadius);

  // Ball's physics properties
  this.body.setMaxSpeed(BALL_MAX_SPEED);
  this.body.setDrag(0, 0);
  this.body.setBounce(BALL_BOUNCE);
}

export default Ball;
