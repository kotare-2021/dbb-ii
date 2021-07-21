import MergedInput from '../main.js'

export default class EndGameScreen extends Phaser.Scene {
  constructor()
  {
    super({ key: 'EndGameScreen'})
  }
  init(data)
  {
    this.scores = data.scores
    this.scoreColours =[`rgb(255, 0, 0)`, `rgb(0, 255, 0)`, `rgb(0, 0, 255)`, `rgb(255, 255, 0)`, `rgb(0, 255, 255)`]
    this.loadFont("Ruslan", "assets/RuslanDisplay-Regular.ttf")
  }
  preload()
  {
    this.load.scenePlugin('mergedInput', MergedInput);
    this.load.image('ebg', './assets/endscreen.png')
    this.load.image('home', './assets/home.png')
  }
  create()
  {
    var bg = this.add.image(640, 360, 'ebg')
    var home = this.add.image(600, 650, 'home').setInteractive().setScale(0.6)
    home.once('pointerup', this.sendHome, this)
    this.scores.forEach((x, i) => {
      this.add.text(220 * x.id, 200,
         `Player ${x.id}\n
${x.score} points`,
          { fontFamily: 'Ruslan', fontSize: 40, color: this.scoreColours[i] })
          .setShadow(2, 2, "#333333", 2, false, true);
    })
}
sendHome()
  {
    this.scene.start('LandingScreen')
  }

loadFont(name, url) {
  var newFont = new FontFace(name, `url(${url})`);
  newFont.load().then(function (loaded) {
      document.fonts.add(loaded);
  }).catch(function (error) {
      return error;
  });
}
}