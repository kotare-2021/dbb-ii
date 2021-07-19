import MergedInput from "../main";
import Fighter from './Fighter'
import collision from "./collision"

export default class Arena extends Phaser.Scene {
  
  
  preload() {
  this.load.scenePlugin('mergedInput', MergedInput);
  this.load.multiatlas('gamepad', 'assets/gamepad.json', 'assets');
  this.load.image('player', 'assets/Player.png')
  this.load.image('block', 'assets/Block.png')
  this.load.image('dash', 'assets/Dash.png')
  this.load.image('ball', 'assets/Ball.png')

  //Setup for loading the base tilemap and required tile images
  this.load.image('base_tiles', 'assets/triangle.png')
  this.load.tilemapTiledJSON('tilemap', `assets/${this.mapData}`)

  //sound set up
  this.load.audio('battery', 'assets/battery.wav')
  this.load.audio('lazer', 'assets/lazer.wav')
  this.load.audio('blaster', 'assets/blaster.mp3')
  this.load.audio('numkey', 'assets/numkey.wav')
  this.load.audio('stop', 'assets/stop.wav')
  this.load.audio('keys', 'assets/keys.wav')
}

    


create() {
  //Setup for loading the base tilemap and required tile images
  const map = this.make.tilemap({ key: 'tilemap' })
  const tileset = map.addTilesetImage('Triangle', 'base_tiles')
  // create the layers we want in the right order
  const backgroundLayer = map.createLayer('Tile Layer 1', tileset, 0, 0)
  const middleLayer = map.createLayer('Tile Layer 2', tileset, 0, 0)
  backgroundLayer.setScale(0.8)
  middleLayer.setScale(0.8)

  //smooth out fps
  // this.physics.world.syncToRender = true;
  this.physics.world.fixedStep = false;
  // this.physics.world.fixedDelta = true;
  this.physics.world.setBounds(0, 0, 1280, 720)
  middleLayer.setCollisionByProperty({ collides: true });
  middleLayer.setCollisionByExclusion([-1]);
  
  // Set up player objects
  this.player1 = this.mergedInput.addPlayer(1)
  this.player2 = this.mergedInput.addPlayer(2)
  
  var dudes = this.add.group()
  this.start = [[280, 600], [1000, 150], [500, 300], [400, 100]]
  
  this.mergedInput.players.forEach((player, i) => {
    player.fighter = new Fighter(this, this.start[i][0], this.start[i][1]);
    this.add.existing(player.fighter);
    this.physics.add.existing(player.fighter, false);
    this.physics.add.collider(middleLayer, player.fighter);
    player.fighter.score = 0
    player.fighter.start = this.start[i]
    dudes.add(player.fighter)
    this.mergedInput
    .defineKey(1, 'UP', 'W')
    .defineKey(1, 'DOWN', 'S')
    .defineKey(1, 'LEFT', 'A')
    .defineKey(1, 'RIGHT', 'D')
    .defineKey(i, 'B0', 'ONE')
    .defineKey(i, 'B1', 'TWO')
    .defineKey(i, 'B2', 'THREE')
    .defineKey(i, 'B3', 'FOUR')
    .defineKey(i, 'B4', 'FIVE')
    .defineKey(i, 'B5', 'SIX')
    .defineKey(i, 'B6', 'SEVEN')
    .defineKey(i, 'B7', 'EIGHT')
    .defineKey(i, 'B8', 'NINE')
    .defineKey(i, 'B9', 'ZERO')
  })

  
  this.physics.add.collider(this.player1.fighter, this.player2.fighter, collision)
  console.log(this.mergedInput)
  // Set up some debug text
  
  this.playerTexts = []
  
  this.mergedInput.players.forEach((player, i) => {
    const spaceBetween = 1000;
    this.playerTexts[i] = this.add.text(100 + (spaceBetween * i), 50, player.fighter.score, {
      fontFamily: 'Arial',
      fontSize: 44,
      color: randomColor(),//'#00ff00'
    });

    // Used for distinguishing different controller texts
    // while debugging
    function randomColor() {
      let [r, g, b] = Array.from(new Array(3)).map(randomByte);
      return `rgb(${r}, ${g}, ${b})`
      // *** helper ***
      function randomByte() {
        return Math.floor(Math.random() * 256);
      }
    }
    console.log(this.playerTexts)
  })

  // Instructions
  // var scores1 = this.add.text(50, 20, scores[0], {
  //     fontFamily: 'Arial',
  //     fontSize: 34,
  //     color: '#00ff00'
  // });
  // var scores2 = this.add.text(740, 20, scores[1], {
  //     fontFamily: 'Arial',
  //     fontSize: 34,
  //     color: '#00ff00'
  // });
}

update() {
  // Loop through player inputs
  for (let thisPlayer of this.mergedInput.players) {
    this.playerTexts[thisPlayer.index].text = thisPlayer.fighter.score
    let { fighter } = thisPlayer;
    fighter.update(thisPlayer, this.mergedInput.players)
      
    for (let thisButton in thisPlayer.buttons) {
    }
  }
}
}