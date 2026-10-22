export function dticTableParams(config, { start = 0, length = 10, search = '' } = {}) {
  const params = { sEcho: 1, iDisplayStart: start, iDisplayLength: length, sSearch: search, iColumns: config.columns.length, iSortingCols: 0 }
  config.columns.forEach((column, i) => Object.assign(params, { ['mDataProp_' + i]: column || '', ['bSortable_' + i]: false, ['bSearchable_' + i]: true }))
  return params
}
