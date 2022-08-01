/**
 * отнять заданное значение от альфа канала цвета
 * @param {string} name цвет
 * @param {number} sub вычитаемое значение (от 0 до 1)
 * @returns {string} hex
 */
export function subAlpha(name: string, sub: number): string {
  let fakeDiv = document.createElement('div')
  fakeDiv.style.color = name
  document.body.appendChild(fakeDiv)

  let computedStyle = window.getComputedStyle(fakeDiv)
  let color = computedStyle.getPropertyValue('color')

  document.body.removeChild(fakeDiv)

  const [, red, green, blue, alpha] = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/) || []
  const newAlpha = Math.round(255 * (Number(alpha || 1) - sub))
  return `#${Number(red).toString(16)}${Number(green).toString(16)}${Number(blue).toString(16)}${newAlpha.toString(16)}`
}
