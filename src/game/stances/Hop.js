import { Stances } from "../fighter";

const HOP_SPEED = 10000;
const HOPPER_MAX_SPEED = 800;

function Hop(_, x, y) {
  if (this.state == Stances.IDLE) {
    this.body.setMaxSpeed(HOPPER_MAX_SPEED);
    this.body.setDrag(0, 0);

    // The hopping movement itself
    this.body.setVelocityY(y * HOP_SPEED);
    this.body.setVelocityX(x * HOP_SPEED);

    // This is not really a stance,
    // Junp cooldowns should be implemented differently.
    this.setStance(Stances.JUMPED);
  }
}

export default Hop;
