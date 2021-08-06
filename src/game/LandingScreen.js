import MergedInput from '../main.js'
// eslint-disable-next-line no-undef
export default class LandingScreen extends Phaser.Scene {

  
  constructor ()
  {
    super({ key: 'LandingScreen' });
  }
  init()
  {
    this.sunMap = {
      mapData: 'sun_map.json', tileData: "gridtiles.png", backgroundData:  "sun_background.png", spawns: []
    }
    this.eyeMap = {
      mapData: 'eye_background.json', tileData: "gridtiles.png", backgroundData:  "eye_background.png", spawns: []
    }
    this.dragonMap = {
      mapData: 'dragon_background.json', tileData: 'gridtiles.png', backgroundData: 'dragon_background.png', spawns: []
    }
    this.playerNumber = 0
    this.eyeSpawns = [[100, 500], [1175, 550], [475, 600], [810, 600], [495, 450], [820, 450], [225, 150], [1070, 150], [480 ,50], [800, 50], [645, 50], [645, 500]]
    this.dragonSpawns = [[80, 100], [350, 50], [622, 100], [945, 25], [1250, 25], [1185, 400], [945, 550], [722, 325], [530, 375], [200, 550]]
    this.sunSpawns = [[115, 100], [495, 50], [293, 250], [602, 300], [470, 600], [90, 600], [800, 600], [1200, 600], [1100, 250]]
  }
  
  preload ()
  {
    this.load.scenePlugin('mergedInput', MergedInput);
    this.load.image('button', './assets/select.png')
    this.load.image('bg', './assets/start_screen.png')
    this.load.image('sun', './assets/sun_screenshot.PNG')
    this.load.image('dragon', './assets/dragon_screenshot.PNG')
    this.load.image('eye', './assets/eye_screenshot.PNG')
    this.load.image('close', './assets/pixel-x.png')
    this.loadFont('Ruslan', './assets/RuslanDisplay-Regular.ttf')
  }
  
  create()
  {
    this.add.image(640, 360, 'bg').setScale(0.8)
    const sunShot = this.add.image(310, 565, 'sun').setInteractive().setScale(0.3)
    const dragonShot = this.add.image(645, 565, 'dragon').setInteractive().setScale(0.3)
    const eyeShot = this.add.image(970, 565, 'eye').setInteractive().setScale(0.3)
    this.add.text(390, 400, 'Click a map to play!', {
        fontFamily: 'Ruslan', 
        fontSize: 40
    }).setShadow(2, 2, "#333333", 2, false, true);
    sunShot.once('pointerup', this.startSunMap, this)
    dragonShot.once('pointerup', this.startDragonMap, this)
    eyeShot.once('pointerup', this.startEyeMap, this)
  }
  startEyeMap()
  {
    let playerNumber = this.mergedInput.players.length
    this.scene.start('Arena', { 
      mapData: 'eye_background.json',
      tileData: "gridtiles.png",
      backgroundData:  "eye_background.png",
       numberOfPlayers: (playerNumber === 0) ? 2 : playerNumber,
        spawns:  this.eyeSpawns
    })
  }
  startDragonMap()
  {
    let playerNumber = this.mergedInput.players.length
    this.scene.start('Arena', 
      { 
        mapData: 'dragon_background.json', 
        tileData: "gridtiles.png", 
        backgroundData: "dragon_background.png",
        numberOfPlayers: (playerNumber === 0) ? 2 : playerNumber, 
        spawns:  this.dragonSpawns
      })
  }
  startSunMap()
  {
    let playerNumber = this.mergedInput.players.length
    this.scene.start('Arena', 
      { 
        mapData: 'sun_map.json', 
        tileData: "gridtiles.png", 
        backgroundData: "sun_background.png", 
        numberOfPlayers: (playerNumber === 0) ? 2 : playerNumber, 
        spawns: this.sunSpawns
      })
    }
  update()    
  {
    this.mergedInput.players.forEach((player, i) => { 
        this.add.text(200 * i + 200, 150, `Player ${i + 1} joined!`, { fontFamily: 'Ruslan', fontSize: 20, color: '#00ff00' })
        .setShadow(2, 2, "#333333", 2, false, true);
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
