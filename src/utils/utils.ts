/**
 * Бинарный поиск элемента x в массиве [x, y, x, y,...]
 * @param {number} x - искомый элемент
 * @param {Float32Array} A - массив в котором ищем
 * @return {number} index найденного элемента или элемента предшествующего ближайшему больше найденого
 */
export function bSearchX(x: number, A: Float32Array): number {
  let i = 0,
    j = A.length,
    k

  while (i < j) {
    k = Math.floor((i + j) / 4) * 2
    if (x <= A[k]) j = k
    else i = k + 2
  }

  return i > A.length - 1 ? i - 2 : i
}
