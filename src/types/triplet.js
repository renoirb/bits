/**
 * @bit
 * @public
 * @name types/triplet
 * @description A Triplet consist of a set of 3 elements; a field, an operator and an operand that is a pipe separated list of strings
 * @param {string} field a field name
 * @param {string} operator an operator, e.g. in, nin, eq, neq, lt, gt
 * @param {string} operands a string with pipe separated list of values to filter about using specified operator on given field
 * @example
 * const triple = new Triplet('UserName', 'eq', 'alice')
 * console.log('UserName_$eq_$alice' === triple.toString()) // => true
 * console.log(triple.field) // => 'UserName'
 * console.log(triple.operator) // => 'eq'
 * console.log(triple.operands[0]).to.equal('alice')
 */
class Triplet {
  constructor (field, operator, operands) {
    this.field = field
    this.operator = operator
    this.operands = operands.split('|')
  }
  static parse (notation = '') {
    if (notation.includes(',')) {
      const message = `Invalid notation ("${notation}"), a Triplet cannot have a coma`
      throw new Error(message)
    }
    const alphanumericRegEx = /^[0-9a-z]*$/i
    const comparsionRegEx = /^(eq|ne|lte?|gte?|n?in)$/i

    const splitter = notation.match(/(_\$)/g) || []
    const hasTwo = splitter.length === 2
    if (hasTwo) {
      const [
        field,
        operator,
        operand
      ] = notation.split('_$')
      const fieldIsAlphanum = alphanumericRegEx.test(field)
      const purifiedOperand = operand.split('|').filter(m => (m || []).length > 0 && alphanumericRegEx.test(m)).join('|')
      const operandsIsNonEmpty = purifiedOperand.length > 0
      const operatorMustBeValid = comparsionRegEx.test(operator)
      // console.log('parse', {fieldIsAlphanum, operandsIsNonEmpty, operatorMustBeValid})
      if (fieldIsAlphanum && operandsIsNonEmpty && operatorMustBeValid) {
        return new Triplet(field, operator, purifiedOperand)
      }
    }

    return false
  }
  toString () {
    let triplet = []
    triplet.push(this.field)
    triplet.push(this.operator)
    triplet.push(this.operands.join('|'))
    return triplet.join('_$')
  }
}

export default Triplet
