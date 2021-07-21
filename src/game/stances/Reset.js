import { Stances } from "../fighter";
import Dash from "./Dash";

const IDLE_WIDTH = 605;
const IDLE_HEIGHT = 580;
const IDLE_DRAG = 80;
const IDLE_SCALE = 0.1;

// This function defines the properties of
// the player when no stance button is down

// The goal is to prevent "residual" properties
// from the previous stance affecting the idle
// stance

// For example, if being a ball makes the player
// extremely bouncy, then we want to make sure the
// bouncieness gets reset on the next frame where
// the player is not a ball.

// i.e. "*ALL* properties modified by stances should be
// reset here.

function Reset(angle, x, y) {
  // Reset sprite & state
  this.setStance(Stances.IDLE);

  // Undo Block's immobility
  this.body.moves = true;

  // Undo ball's bounciness
  this.body.setBounce(0);

  // Undo ball's zero-drag
  this.body.setDrag(IDLE_DRAG, 0);

  // Return to idle max speed
  // (modified by hop & ball)
}

export default Reset;
