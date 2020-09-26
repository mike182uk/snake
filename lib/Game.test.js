/* global describe, test, expect */

const { EventEmitter } = require('events')
const { Game } = require('./Game')

describe('Game', () => {
  test('it is an event emitter', () => {
    const game = new Game({})

    expect(game).toBeInstanceOf(EventEmitter)
  })
})
