import Dash from "./stances/Dash"
import Block from "./stances/Block"
import Ball from "./stances/Ball"

const LUBRICATION = 50;

const ControlScheme = Object.freeze({
  // Flappy-bird-esque jumping
  ACTION_FLAP: "B0",
  STANCE_DASH: "keydown-B5",
  STANCE_BLOCK: "keydown-B4",
  STANCE_BALL: "keydown-B2",
})

const Stances = Object.freeze({
  DASH: "DASH",
  BLOCK: "BLOCK",
  BALL: "BALL"
});

// const States = 

export default class Fighter extends Phaser.GameObjects.Sprite {
  constructor(arena, x, y, controlScheme = ControlScheme) {
    super(arena, x, y)
    this.sprite = "player"
    this.setScale(0.1);
    this.setTexture(this.sprite)
    this.setPosition(x, y)
    this.controlScheme = controlScheme
  }

  update(input) {

    let {direction, buttons} = input;
    let { UP, DOWN, LEFT, RIGHT } = direction;
    let accelerationX = RIGHT - LEFT;
    let accelerationY = DOWN - UP;
    this.body.acceleration.x = accelerationX * LUBRICATION;
    this.body.acceleration.y = accelerationY * LUBRICATION;

    // if the player presses A:
    if (buttons[this.controlScheme.ACTION_FLAP]) {
     console.log(`P${input.index+1} is flapping: Flap! Flap!`);
    }

    if  (buttons[this.controlScheme.STANCE_BALL]) {
      Ball.bind(this)();
    }

    if (buttons[this.controlScheme.STANCE_BLOCK]) {
      Block.bind(this)();
    }

    if (buttons[this.controlScheme.STANCE_DASH]) {
      Dash.bind(this)();
    }

    if (this.y > 720) {
      this.y = -32
    }
    if (this.y < -32) {
      this.y = 730
    }

    if (this.x < 0) {
      this.x = 1279
    }
    if (this.x > 1284) {
      this.x = 1
    }
  }
}
