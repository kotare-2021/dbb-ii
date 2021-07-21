import Arena from "./arena.js";
import LandingScreen from './LandingScreen.js'
import EndGameScreen from "./EndGameScreen.js";

const config = {
  parent: "monitor",
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  input: {
    gamepad: true,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 1000 },
      debug: false,
    },
  },
  scene: [
      LandingScreen,
      Arena,
      EndGameScreen
  ]

};

const game = new Phaser.Game(config);
