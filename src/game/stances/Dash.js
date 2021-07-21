const DASH_SPEED = 800;

function Dash(angle, x, y) {
  this.setStance(Stances.DASH);
  this.body.moves = true;
  this.setRotation(angle);
  this.body.setVelocityX(x * DASH_SPEED);
  this.body.setVelocityY(y * DASH_SPEED);
  this.body.setMaxSpeed(DASH_SPEED);
}

export default Dash;
