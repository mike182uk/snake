/* global describe, test, expect */

const Matrix = require('./Matrix')

describe('Matrix', () => {
  test('matrix is initialized', () => {
    const matrix = new Matrix(2, 3, 'x')

    expect(matrix.get()).toEqual(
      [
        ['x', 'x', 'x'],
        ['x', 'x', 'x']
      ]
    )
  })

  test('matrix is initialized with default value', () => {
    const matrix = new Matrix(2, 3)

    expect(matrix.get()).toEqual(
      [
        [0, 0, 0],
        [0, 0, 0]
      ]
    )
  })

  test('copy of matrix is retrieved', () => {
    const matrix = new Matrix(2, 3)
    const m2 = matrix.get()
    m2[0][1] = 1

    expect(matrix.get()).toEqual(
      [
        [0, 0, 0],
        [0, 0, 0]
      ]
    )
  })

  test('value in matrix can be set', () => {
    const matrix = new Matrix(2, 3)

    matrix.setValue(1, 2, 1)

    expect(matrix.get()).toEqual(
      [
        [0, 0, 0],
        [0, 0, 1]
      ]
    )
  })

  test('error is thrown if out of bounds row provided when setting a matrix value', () => {
    const matrix = new Matrix(2, 3)

    expect(() => matrix.setValue(5, 2, 1)).toThrow(/Row 5 is out of bounds/)
    expect(() => matrix.setValue(-2, 2, 1)).toThrow(/Row -2 is out of bounds/)
  })

  test('error is thrown if out of bounds column provided when setting a matrix value', () => {
    const matrix = new Matrix(2, 3)

    expect(() => matrix.setValue(0, 5, 1)).toThrow(/Column 5 is out of bounds/)
    expect(() => matrix.setValue(0, -2, 1)).toThrow(/Column -2 is out of bounds/)
  })
})
