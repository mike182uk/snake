#!/usr/bin/env node

const logUpdate = require('log-update')
const readline = require('readline')
const {
  Game,
  ACTION_MOVE_UP,
  ACTION_MOVE_DOWN,
  ACTION_MOVE_LEFT,
  ACTION_MOVE_RIGHT,
  ACTION_QUIT,
  EVENT_TICK,
  STATUS_FINISHED
} = require('./lib/Game')

/**
 * Initialise game
 */

const game = new Game({
  size: 14, // 14x14
  emptyValue: ' ',
  snakeValue: '*',
  extensionValue: 'o'
})

/**
 * Initialise input
 */

// Ensure single keypresses are registered
readline.emitKeypressEvents(process.stdin)
process.stdin.setRawMode(true)

process.stdin.on('keypress', (str, key) => {
  if (key.sequence === '\u0003') {
    game.executeAction(ACTION_QUIT)

    return
  }

  switch (key.name) {
    case 'up':
      game.executeAction(ACTION_MOVE_UP)
      break
    case 'down':
      game.executeAction(ACTION_MOVE_DOWN)
      break
    case 'left':
      game.executeAction(ACTION_MOVE_LEFT)
      break
    case 'right':
      game.executeAction(ACTION_MOVE_RIGHT)
      break
  }
})

/**
 * Initialise events
 */

game.on(EVENT_TICK, ({ matrix, score, status, size }) => {
  // Build frame and render to the console
  matrix = matrix.get()
  let frame = ''

  const horizontalBorder = Array.from({ length: size }, () => '─').join('')

  frame += `\nScore: ${score}\n`
  frame += `╭${horizontalBorder}╮`
  frame += '\n'
  frame += matrix.map((row) => `│${row.join('')}│`).join('\n')
  frame += '\n'
  frame += `╰${horizontalBorder}╯`
  frame += '\n'

  if (status === STATUS_FINISHED) {
    frame += '\n'
    frame += `GAME OVER! You scored ${score}`
    frame += '\n'
  }

  logUpdate(frame)

  // Exit process if the game has finished
  if (status === STATUS_FINISHED) {
    process.exit()
  }
})

/**
 * Start the game
 */

game.start(300)
