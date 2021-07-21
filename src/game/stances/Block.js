import { Stances } from "../fighter";

function Block(angle) {
  this.setRotation(angle);
  this.setTexture("block");
  this.setState(Stances.BLOCK);
  this.body.stop();
  this.body.moves = false;
}

export default Block;
