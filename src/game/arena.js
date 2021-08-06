import MergedInput from "../main"
import Fighter from "./Fighter"



const Stances = {
  DASH: "DASH",
  BLOCK: "BLOCK",
  BALL: "BALL",
  IDLE: "IDLE",
}

export const pointlights = []
// eslint-disable-next-line no-undef
export default class Arena extends Phaser.Scene {

  constructor()
    {
        super({ key: "Arena" })
    }
  init(data)
    {
        console.log('init', data)
        this.mapData = data.mapData
        this.tileData = data.tileData
        this.backgroundData = data.backgroundData
        this.numberOfPlayers = data.numberOfPlayers
        this.spawns = data.spawns
    }


  preload() {

    this.load.scenePlugin("mergedInput", MergedInput);
    this.load.multiatlas("gamepad", "assets/gamepad.json", "assets");
    this.load.image("spark", "assets/blue.png");
    this.loadFont('Ruslan', './assets/RuslanDisplay-Regular.ttf')

    this.load.image("fullscreen", "assets/fullscreen.png")



    //sound set up
    this.load.audio('battery', 'assets/battery.wav')
    this.load.audio('lazer', 'assets/lazer.wav')
    this.load.audio('blaster', 'assets/blaster.mp3')
    this.load.audio('numkey', 'assets/numkey.wav')
    this.load.audio('stop', 'assets/stop.wav')
    this.load.audio('keys', 'assets/keys.wav')

    //Setup for loading the base tilemap and required tile images
    this.load.tilemapTiledJSON("tilemap", `assets/${this.mapData}`)
    this.load.image("base_tiles", `assets/${this.tileData}`)
    this.load.image("background_tiles", `assets/${this.backgroundData}`)

    //Load up spritesheets
    this.load.spritesheet('hop', 'assets/JumpBean.png', {
      frameWidth: 640,
      frameHeight: 640
    })
    this.load.spritesheet('left', 'assets/RunBeanLeft.png', {
      frameWidth: 640,
      frameHeight: 640
    })
    this.load.spritesheet('right', 'assets/RunBeanRight.png', {
      frameWidth: 640,
      frameHeight: 630
    })
    this.load.spritesheet('Leaf2Ball', 'assets/Leaf2Ball.png', {
      frameWidth: 64,
      frameHeight: 64
    })
    this.load.spritesheet('Bean2Pot', 'assets/Bean2Pot.png', {
      frameWidth: 640,
      frameHeight: 640
    })
    this.load.spritesheet('Ball2Pot', 'assets/Ball2Pot.png', {
      frameWidth: 64,
      frameHeight: 64
    })
    this.load.spritesheet('Bean2Leaf', 'assets/Bean2Leaf.png', {
      frameWidth: 625,
      frameHeight: 640
    })
    this.load.spritesheet('Bean2Ball', 'assets/Bean2Ball.png', {
      frameWidth: 640,
      frameHeight: 640
    })
    this.load.spritesheet('Pot2Leaf', 'assets/Pot2Leaf.png', {
      frameWidth: 64,
      frameHeight: 64
    })

  }

  
  create() {
    //Setup for loading the base tilemap and required tile images
    const map = this.make.tilemap({ key: "tilemap" })
    
    const backgroundTileset = map.addTilesetImage(
      "background",
      "background_tiles"
    )
    const backgroundLayer = map.createLayer(
      "backgroundLayer",
      backgroundTileset,
      0,
      0
    )
    const middleTileset = map.addTilesetImage("platforms_L1", "base_tiles")
    const middleLayer = map.createLayer("middleLayer", middleTileset, 0, 0)
      
    backgroundLayer.setScale(0.8)
    middleLayer.setScale(0.8)
        
    //fullscreen
    var button = this.add.image(1220, 30, 'fullscreen', 50).setOrigin(1, 0).setInteractive();
    button.setScale(0.1)
    button.on('pointerup', function () {
        if (this.scale.isFullscreen)
        {
            button.setFrame(0);
            this.scale.stopFullscreen();
        }
        else
        {
            button.setFrame(1);
            this.scale.startFullscreen();
        }
    }, this);
    //fullscreen

    //smooth out fps
    // this.physics.world.syncToRender = true
    this.physics.world.fixedStep = false
    this.physics.world.setBounds(0, 0, 1280, 720)
    middleLayer.setCollisionByProperty({ collides: true })
    middleLayer.setCollisionByExclusion([-1])
    
    // Set up player objects
    this.players = Array.from(new Array(this.numberOfPlayers)).map((_, i) =>
    this.mergedInput.addPlayer(i)
    )

    let playerGroup = this.add.group()
    this.starts = [
      [280, 600],
      [1000, 150],
      [500, 300],
      [400, 100],
    ]
        
        // setup lighting + particles
    this.lights.enable()
    this.lights.active = true
    this.trails = []
    this.playerColors = [[255, 0, 0], [0, 255, 0], [0, 0, 255], [255, 255, 0]]
    
    let randomSpawn = [];
 
    
    // Creates new array of random spawns based on amount of players in the game
    for (var i = 0; i < this.players.length; i++) {
          var n = Math.floor(Math.random() * this.spawns.length);
          randomSpawn.push(this.spawns[n]);
          this.spawns.splice(n, 1);
      }
      console.log('Array of random cords', randomSpawn)

    this.players.forEach((player, i) => {
      let [x, y] = randomSpawn[i]
      player.fighter = new Fighter(this, x, y)
      this.add.existing(player.fighter)
      this.physics.add.existing(player.fighter, false)
      this.physics.add.collider(middleLayer, player.fighter)
      player.fighter.score = 0
      player.index = i
      playerGroup.add(player.fighter)
      player.fighter.setTexture('right')

      // create trail for players
      player.fighter.trail = this.add.particles('spark').createEmitter({
        speed: { min: 0, max: 0 },
        scale: { start: 0.4, end: 0.1 },
        alpha: { start: 0.3, end: 0, ease: 'Expo.easeIn' },
        blendMode: 'SCREEN',
        lifespan: 500,
        follow: player.fighter,
        active: false
      })
      player.fighter.trail.reserve(1000)

      // create player backlight
      let [r, g, b] = this.playerColors[i]
      player.fighter.glow = this.add.pointlight(x, y, 0, 100, 0.3, 0.05)
      player.fighter.glow.color.r = r
      player.fighter.glow.color.g = g
      player.fighter.glow.color.b = b
    })
    
    // Define keys (player, action, key, append)
    this.mergedInput
      .defineKey(0, "UP", "W")
      .defineKey(0, "DOWN", "S")
      .defineKey(0, "LEFT", "A")
      .defineKey(0, "RIGHT", "D")

      .defineKey(1, "UP", "UP")
      .defineKey(1, "DOWN", "DOWN")
      .defineKey(1, "LEFT", "LEFT")
      .defineKey(1, "RIGHT", "RIGHT")

      .defineKey(0, "B0", "X")//Flap
      .defineKey(0, "B2", "C")//Ball
      .defineKey(0, "B4", "V")//Block
      .defineKey(0, "B5", "B")//Dash

      .defineKey(1, "B0", "U")//Flap
      .defineKey(1, "B2", "I")//Ball
      .defineKey(1, "B4", "O")//Block
      .defineKey(1, "B5", "P")//Dash

      function rockPaperScissors(fighter, opponent) {
        const { BALL, BLOCK, DASH, IDLE } = Stances;
        switch (fighter.state) {
          case BALL:
            if (opponent.state == IDLE || opponent.state == BLOCK) {
              return handleWin(fighter, opponent, "battery");
            } else if (opponent.state == DASH) {
              return handleWin(opponent, fighter, "lazer");
            }
            break;
          case BLOCK:
            if (opponent.state == IDLE || opponent.state == DASH) {
              return handleWin(fighter, opponent, "stop");
            } else if (opponent.state == BALL) {
              return handleWin(opponent, fighter, "battery");
            }
            break;
          case DASH:
            if (opponent.state == IDLE || opponent.state == BALL) {
              return handleWin(fighter, opponent, "lazer");
            } else if (opponent.state == BLOCK) {
              return handleWin(opponent, fighter, "stop");
            }
            break;
          case IDLE:
            if (!["JUMPED", IDLE].includes(opponent.state)) {
              return handleWin(opponent, fighter, "stop");
            }
            break;
          default:
            return [null, null];
          }

      function handleWin(winner, loser) {
        loser.setPosition(loser.spawn.x, loser.spawn.y);
        loser.body.enable = false;
        loser.body.velocity.x = 0;
        loser.body.velocity.y = 0;
        loser.setActive(false).setVisible(false);
        winner.score += 1
        setTimeout(() => {
          loser.setActive(true).setVisible(true);
          loser.body.enable = true;
          return;
        }, 1000)
      }
    }

    for (let a of this.players) {
      for (let b of this.players) {
        if (a.index != b.index) {
          this.physics.add.collider(a.fighter, b.fighter, rockPaperScissors)
        }
      }
    }

    // Set up some debug text

    this.debugTexts = []
    this.scoreTexts = []

    this.players.forEach((player, i) => {
      let r = this.playerColors[i][0]
      let g = this.playerColors[i][1]
      let b = this.playerColors[i][2]

      const scoreTextSpace = 300
      this.scoreTexts[i] = this.add.text(
        100 + scoreTextSpace * i,
        50,
        player.fighter.score,
        {
          fontFamily: "Ruslan",
          fontSize: 44,
          color: `rgb(${r}, ${g}, ${b})`, //'#00ff00'
        }
      ).setShadow(2, 2, "#333333", 2, false, true);

      // Used for distinguishing different controller texts
      // while debugging
      // function randomColor() {
      //   let [r, g, b] = Array.from(new Array(3)).map(randomByte)
      //   return `rgb(${r}, ${g}, ${b})`
      //   // *** helper ***
      //   function randomByte() {
      //     return Math.floor(Math.random() * 256)
      //   }
      // }
    })

    // setup sprite animations
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('left', { start: 0, end: 5 }),
      frameRate: 12,
      repeat: -1
    })
    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('right', { start: 0, end: 5 }),
      frameRate: 12,
      repeat: -1
    })
    this.anims.create({
      key: 'hop',
      frames: this.anims.generateFrameNumbers('hop'),
      frameRate: 15,
      repeat: 0,
    })
    this.anims.create({
      key: 'Bean2Leaf',
      frames: this.anims.generateFrameNumbers('Bean2Leaf'),
      frameRate: 60,
      repeat: 0,
    })
    this.anims.create({
      key: 'Bean2Leaf2',
      frames: this.anims.generateFrameNumbers('Bean2Leaf'),
      frameRate: 30,
      repeat: 0,
    })
    this.anims.create({
      key: 'Bean2Pot',
      frames: this.anims.generateFrameNumbers('Bean2Pot'),
      frameRate: 30,
      repeat: 0,
    })
    this.anims.create({
      key: 'Bean2Pot2',
      frames: this.anims.generateFrameNumbers('Bean2Pot'),
      frameRate: 30,
      repeat: 0,
    })
    this.anims.create({
      key: 'Bean2Ball',
      frames: this.anims.generateFrameNumbers('Bean2Ball'),
      frameRate: 45,
      repeat: 0,
    })
    this.anims.create({
      key: 'Bean2Ball2',
      frames: this.anims.generateFrameNumbers('Bean2Ball'),
      frameRate: 30,
      repeat: 0,
    })
  }

  update() {
    // Loop through player inputs
    this.players.forEach((player, i) => {
      let { fighter, buttons, direction } = player
      let { UP, DOWN, LEFT, RIGHT } = direction
      let dx = Number(RIGHT) - Number(LEFT)
      let dy = Number(DOWN) - Number(UP)
      let angle = Math.atan2(dy, dx)

      this.scoreTexts[i].setText(player.fighter.score)
      fighter.body.setSize(640, 640)
      fighter.update(player)

      //sets win condition(first to 11) then sends player scores to end scene
      let scoreArr = []
      this.players.forEach((player) => {
          if (player.fighter.score === 11){
            this.players.map((pl) => {
              scoreArr.push({
                id: pl.index + 1,
                score: pl.fighter.score
              })
            })
            this.scene.start('EndGameScreen', {scores: scoreArr})
          }
        })

      //control handling for animations
      if (buttons.B0) {
        fighter.anims.play('hop')
      } else if (buttons.B5) {
        fighter.anims.play('Bean2Leaf')
        fighter.setRotation(angle)
      } else if (buttons.B4 > 0) {
        if(fighter.anims.getName() !== 'Bean2Pot') {
          fighter.anims.play('Bean2Pot')
        }
      } else if (buttons.B2) {
        if(fighter.anims.getName() !== 'Bean2Ball') {
          fighter.anims.play('Bean2Ball')
        }
      } else if ((LEFT > 0 && RIGHT === 0) 
        && fighter.state === Stances.IDLE 
        && fighter.body.velocity.y === 0) {
          // if (fighter.state !== Stances.DASH) fighter.setFlipX(LEFT > 0)
          console.log('left')
          fighter.anims.play('left', 24, false)
      } else if ((LEFT === 0 && RIGHT > 0) 
      && fighter.state === Stances.IDLE 
      && fighter.body.velocity.y === 0) {
        // if (fighter.state !== Stances.DASH) fighter.setFlipX(LEFT > 0)
        console.log('right')
        fighter.anims.play('right', 24, false)
      } else {
        let anim = fighter.anims.getName()
        switch (anim) {
          case 'Bean2Pot':
            fighter.anims.playReverse('Bean2Pot2', 30, false)
            break
          case 'Bean2Leaf':
            if (fighter.state !== Stances.DASH) {
              fighter.anims.playReverse('Bean2Leaf2')
            }
            break
          case 'Bean2Leaf2':
            fighter.setRotation(0)
            break
          case 'Bean2Ball':
            fighter.anims.playReverse('Bean2Ball2', 30, false)
            break
          case 'left':
            if (LEFT == 0 || RIGHT == 0) {
              fighter.anims.stop('left', 24, false)
            }
            break
          case 'right':
            if (LEFT == 0 || RIGHT == 0) {
              fighter.anims.stop('right', 24, false)
            }
            break
          default:
            return
        }
        fighter.update(player)
      }
    })
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
