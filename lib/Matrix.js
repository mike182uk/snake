class Matrix {
  constructor (rows, columns, initValue = 0) {
    this._rowCount = rows
    this._columnCount = columns

    this._matrix = Array.from(
      { length: rows },
      () => Array.from({ length: columns }, () => initValue)
    )
  }

  get () {
    return this._matrix.map((row) => [...row])
  }

  setValue (row, column, value) {
    if (row < 0 || row > this._rowCount - 1) {
      throw new Error(`Row ${row} is out of bounds`)
    }

    if (column < 0 || column > this._columnCount - 1) {
      throw new Error(`Column ${column} is out of bounds`)
    }

    this._matrix[row][column] = value
  }
}

module.exports = Matrix
