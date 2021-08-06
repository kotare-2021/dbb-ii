import { player1Win, player2Win } from './winFunc'

function collision(player1, player2) {
  console.log(player1, player2)
  if (player1.state === 'dash' && player2.state === 'base') {
    player1Win(player1, player2)
  } else if (player1.state === 'dash' && player2.state === 'ball') {
    player1Win(player1, player2)
  } else if (player1.state === 'dash' && player2.state === 'block') {
    player2Win(player1, player2)
  }  else if (player1.state === 'block' && player2.state === 'ball') {
    player2Win(player1, player2)
  } else if (player1.state === 'block' && player2.state === 'dash') {
    player1Win(player1, player2)
  } else if (player1.state === 'block' && player2.state === 'base') {
    player1Win(player1, player2)
  } else if (player1.state === 'ball' && player2.state === 'dash') {
    player2Win(player1, player2)
  } else if (player1.state === 'ball' && player2.state === 'block') {
    player1Win(player1, player2)
  } else if (player1.state === 'ball' && player2.state === 'base') {
    player1Win(player1, player2)
  }
}

export default collision