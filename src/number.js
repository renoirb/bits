
/**
 * @bit
 * @package lipsum
 * @name number
 * @description Generates a given length number randomly generated
 * @param {number} digits — How many digits long you want the random number be
 * @returns {number}
 * @example
 * number(1) // => 2
 * number(2) // => 32
 * number(4) // => 2327
 */
export default function number (digits = 1) {
  if (Number.isNaN(digits)) {
    throw new Error(`Argument MUST be a number, invalid value ${digits}`)
  }
  const o = []
  while (digits-- && digits > -1) {
    o.push(Math.floor(Math.random() * digits))
  }

  return Number(o.join(''))
}
