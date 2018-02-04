import { default as number } from './number'
import { default as Sentences } from './sentences'

/**
 * @bit
 * @public
 * @name randomizer
 * @description Randomizer parent constructor utility
 * @returns {object} with properties: Numbers, Sentences
 * @package randomiser
 * @namespace renoirb.lipsum
 * @example
 * import {Numbers as randomNumber} from '@bit/renoirb.lipsum.randomizer.index'
 * randomNumber(1) // => 2
 * randomNumber(2) // => 14
 */
export default {Numbers: number, Sentences}
