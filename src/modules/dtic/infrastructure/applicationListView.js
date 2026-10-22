// Keep the original actions and visibility rules; remove legacy inline separators.
export function formatApplicationActions(nodes) {
  return nodes.map(node => {
    if (!node.children) return node
    const isActions = node.attrs?.class?.some(value => typeof value === 'string' && value.split(/\s+/).includes('action-buttons'))
    const children = isActions
      ? node.children.filter(child => !(child.text?.every(part => typeof part === 'string') && /^\s*\|\s*$/.test(child.text.join(''))))
      : node.children
    return { ...node, children: formatApplicationActions(children) }
  })
}
