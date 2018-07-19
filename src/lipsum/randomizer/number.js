/**
 * @bit
 * @public
 * @name number
 * @package randomiser
 * @namespace renoirb.lipsum
 * @description Generates a given length number randomly generated
 * @param {number} digits — How many digits long you want the random number be
 * @returns {number}
 * @example
 * randomNumber(1) // => 2
 * randomNumber(2) // => 32
 * randomNumber(4) // => 2327
 */
export default function randomNumber (digits = 1) {
  if (Number.isNaN(digits)) {
    throw new Error(`Argument MUST be a number, invalid value ${digits}`)
  }
  const max = digits
  const picks = []
  do {
    picks.push(pickBetweenZeroAndNine(digits, max))
  } while (--digits && digits > -1)

  return Number(picks.join(''))
}

/**
 * @private
 * @param {number} position
 * @param {number} max
 */
function pickBetweenZeroAndNine (position, max = 1) {
  // Is it the first iteration?
  // So that, the first digit should not contain a 0
  // Nor being possible, if it is a 1 digit long number
  if (position === max) {
    return Math.floor(Math.random() * 8) + 1
  } else {
    return Math.floor(Math.random() * 10)
  }
}
