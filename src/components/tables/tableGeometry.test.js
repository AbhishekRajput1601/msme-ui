import test from 'node:test'
import assert from 'node:assert/strict'
import { columnWidths } from './tableGeometry.js'

test('retains the proportions of ordinary table columns', () => {
  assert.deepEqual(columnWidths([[{ width: 100 }, { width: 300 }]]), [25, 75])
})

test('keeps unequal leaf columns aligned under grouped and row-spanning headers', () => {
  assert.deepEqual(columnWidths([
    [{ width: 100, rowSpan: 2 }, { width: 300, colSpan: 2 }, { width: 100, rowSpan: 2 }],
    [{ width: 200 }, { width: 100 }],
  ]), [20, 40, 20, 20])
})

test('does not lock hidden or unmeasurable tables', () => {
  assert.deepEqual(columnWidths([[{ width: 0 }, { width: 0 }]]), [])
})
