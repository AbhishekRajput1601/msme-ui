// Header rows may span multiple rows/columns; resolve widths to leaf columns.
export function columnWidths(rows) {
  const occupied = []
  const widths = []
  rows.forEach((cells, rowIndex) => {
    occupied[rowIndex] ||= []
    let column = 0
    cells.forEach(({ width, colSpan = 1, rowSpan = 1 }) => {
      while (occupied[rowIndex][column]) column++
      for (let offset = 0; offset < colSpan; offset++) {
        widths[column + offset] = width / colSpan
        for (let row = rowIndex; row < rowIndex + rowSpan; row++) {
          occupied[row] ||= []
          occupied[row][column + offset] = true
        }
      }
      column += colSpan
    })
  })
  const total = widths.reduce((sum, width) => sum + width, 0)
  return total > 0 ? widths.map(width => width / total * 100) : []
}
