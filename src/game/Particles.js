

export const createTrail = (prop, player) => {
  game.spark = prop.add.particles('spark').createEmitter({
    speed: { min: 0, max: 0 },
    scale: { start: 0.5, end: 0.1 },
    alpha: { start: 0.5, end: 0, ease: 'Expo.easeIn' },
    blendMode: 'SCREEN',
    lifespan: 1000,
    follow: game.player
  })
  game.spark.reserve(1000)
}

export const createExplosion = (prop) => {
  game.dust = prop.add.particles('dust').createEmitter({
    on: false,
    follow: game.player,
    followOffset: -32,
    scale: { start: 0.1, end: 0.6 },
    lifespan: 500
  })
}