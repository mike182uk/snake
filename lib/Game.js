const { EventEmitter } = require('events')
const Matrix = require('./Matrix')

const DIRECTION_UP = 'up'
const DIRECTION_DOWN = 'down'
const DIRECTION_LEFT = 'left'
const DIRECTION_RIGHT = 'right'

const DIRECTIONS = [
  DIRECTION_UP,
  DIRECTION_DOWN,
  DIRECTION_LEFT,
  DIRECTION_RIGHT
]

const EVENT_TICK = 'tick'

const STATUS_IDLE = 'idle'
const STATUS_RUNNING = 'running'
const STATUS_FINISHED = 'finished'

const ACTION_MOVE_UP = 'move_up'
const ACTION_MOVE_DOWN = 'move_down'
const ACTION_MOVE_LEFT = 'move_left'
const ACTION_MOVE_RIGHT = 'move_right'
const ACTION_QUIT = 'quit'

class Game extends EventEmitter {
  constructor ({
    size,
    emptyValue,
    snakeValue,
    foodValue
  }) {
    super()

    this._size = size
    this._emptyValue = emptyValue
    this._snakeValue = snakeValue
    this._foodValue = foodValue
    this._status = STATUS_IDLE
  }

  start (speed) {
    // Cache speed for later use
    this._speed = speed

    // Set starting position as close to the centre as possible
    this._snakeCoords = [
      [
        Math.round((this._size / 2) - 1),
        Math.round((this._size / 2) - 1)
      ]
    ]

    // Set random starting direction
    this._direction = this._nextDirection = DIRECTIONS[
      Math.floor(Math.random() * (DIRECTIONS.length - 1))
    ]

    // Set random food location
    this._foodCoords = this._getRandomAvailableCoords()

    // Setup loop
    this._loop = setInterval(() => {
      this._nextTick()

      if (this._status === STATUS_FINISHED) {
        this.stop()
      }

      this.emit(EVENT_TICK, this.getState())
    }, speed)

    // Setup complete
    this._status = STATUS_RUNNING
    this.emit(EVENT_TICK, this.getState())
  }

  stop () {
    clearInterval(this._loop)
  }

  executeAction (action) {
    switch (action) {
      case ACTION_MOVE_UP:
        this._setDirection(DIRECTION_UP)
        break
      case ACTION_MOVE_DOWN:
        this._setDirection(DIRECTION_DOWN)
        break
      case ACTION_MOVE_LEFT:
        this._setDirection(DIRECTION_LEFT)
        break
      case ACTION_MOVE_RIGHT:
        this._setDirection(DIRECTION_RIGHT)
        break
      case ACTION_QUIT:
        this._status = STATUS_FINISHED
        break
      default:
        throw new Error(`[${action}] is not a valid action`)
    }
  }

  getState () {
    return {
      matrix: this._generateMatrix(),
      score: this._snakeCoords.length - 1,
      status: this._status,
      size: this._size,
      speed: this._speed
    }
  }

  _nextTick () {
    // Update the direction
    this._direction = this._nextDirection

    // Get the current position of the head of the snake
    const head = this._snakeCoords[this._snakeCoords.length - 1]

    // Should the tail of the snake be removed on the next move?
    let removeTail = true

    // Calculate the next move
    let nextRow = head[0]
    let nextCol = head[1]

    switch (this._direction) {
      case DIRECTION_UP:
        nextRow -= 1
        break
      case DIRECTION_DOWN:
        nextRow += 1
        break
      case DIRECTION_LEFT:
        nextCol -= 1
        break
      case DIRECTION_RIGHT:
        nextCol += 1
        break
    }

    // Check for out of bounds
    if (
      nextRow > (this._size - 1) ||
      nextRow < 0 ||
      nextCol > (this._size - 1) ||
      nextCol < 0
    ) {
      this._status = STATUS_FINISHED

      return
    }

    // Check for collision with self
    if (
      this._snakeCoords.find(([row, col]) => row === nextRow && col === nextCol)
    ) {
      this._status = STATUS_FINISHED

      return
    }

    // Check for food
    if (nextRow === this._foodCoords[0] && nextCol === this._foodCoords[1]) {
      // Do not remove the tail so that the size of the snake increases
      removeTail = false

      // Update food position
      this._foodCoords = this._getRandomAvailableCoords()
    }

    // Update snake
    this._snakeCoords.push([nextRow, nextCol])

    if (removeTail) {
      this._snakeCoords.shift()
    }
  }

  _getRandomAvailableCoords () {
    const randomRow = Math.floor(Math.random() * (this._size - 1))
    const randomCol = Math.floor(Math.random() * (this._size - 1))

    // Ensure not on snake
    if (this._snakeCoords.find(([row, col]) => row === randomRow && col === randomCol)) {
      return this._getRandomAvailableCoords()
    }

    return [randomRow, randomCol]
  }

  _setDirection (direction) {
    if (this._snakeCoords.length > 1) {
      // Do not allow invalid moves
      if (
        (this._direction === DIRECTION_UP && direction === DIRECTION_DOWN) ||
        (this._direction === DIRECTION_DOWN && direction === DIRECTION_UP) ||
        (this._direction === DIRECTION_LEFT && direction === DIRECTION_RIGHT) ||
        (this._direction === DIRECTION_RIGHT && direction === DIRECTION_LEFT)
      ) {
        return
      }
    }

    this._nextDirection = direction
  }

  _generateMatrix () {
    const matrix = new Matrix(this._size, this._size, this._emptyValue)

    matrix.setValue(this._foodCoords[0], this._foodCoords[1], this._foodValue)

    this._snakeCoords.forEach(([row, col]) => {
      matrix.setValue(row, col, this._snakeValue)
    })

    return matrix
  }
}

module.exports = {
  Game,
  EVENT_TICK,
  ACTION_MOVE_UP,
  ACTION_MOVE_DOWN,
  ACTION_MOVE_LEFT,
  ACTION_MOVE_RIGHT,
  ACTION_QUIT,
  STATUS_IDLE,
  STATUS_RUNNING,
  STATUS_FINISHED
}
