/**
 * Преобразовать цвет из названия/rgb/hsl в массив [R, G, B, alpha] для webGl
 * @param {string} name
 * @returns {[number, number, number, number]} [R, G, B, alpha]
 */
export function nameToGlRGB(name: string): [number, number, number, number] {
  let fakeDiv = document.createElement('div')
  fakeDiv.style.color = name
  document.body.appendChild(fakeDiv)

  let computedStyle = window.getComputedStyle(fakeDiv)
  let color = computedStyle.getPropertyValue('color')

  document.body.removeChild(fakeDiv)

  const [, red, green, blue, alpha] = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/) || []
  const ret: [number, number, number, number] = [
    +red / 255,
    +green / 255,
    +blue / 255,
    typeof alpha !== 'undefined' ? Number(alpha) : 1,
  ]
  return ret
}
