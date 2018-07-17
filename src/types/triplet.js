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
  constructor(field = null, operator = null, operands = '') {
    this.setField(field)
    this.setOperator(operator)
    this.setOperands(operands)
  }

  static get operatorRegEx() {
    // eq|ne|lt|lte|gt|gte|in|nin|all|exists|regex
    return /^(eq|ne|lte?|gte?|n?in|all|exists|regex)$/i
  }

  static fromString(notation = '') {
    if (notation.includes(',')) {
      const message = `Invalid notation ("${notation}"), a Triplet cannot have a coma`
      throw new Error(message)
    }
    const splitter = notation.match(/(_\$)/g) || []
    const hasTwo = splitter.length === 2
    if (hasTwo) {
      const [field, operator, operands] = notation.split('_$')
      return new Triplet(field, operator, operands)
    }
    return new Triplet()
  }

  isValid() {
    const hasField = typeof this.field === 'string'
    const hasOperator = typeof this.operator === 'string'
    const hasOperands = this.operands.length > 0
    return (
      (hasField === false || hasOperator === false || hasOperands === false) ===
      false
    )
  }

  toString() {
    if (this.isValid() === false) {
      return ''
    }
    let triplet = []
    triplet.push(this.field)
    triplet.push(this.operator)
    triplet.push(this.operands.join('|'))
    return triplet.join('_$')
  }

  setField(field) {
    const fieldIsString = typeof field === 'string'
    const candidate = fieldIsString ? field.replace(/[^a-z0-9\s]/i, '') : null
    this.field = candidate
  }

  setOperator(operator) {
    const candidate = String(operator)
      .replace(/[^a-z0-9]/i, '')
      .toLowerCase()
    const isValid = Triplet.operatorRegEx.test(candidate)
    if (isValid) {
      this.operator = candidate
    } else {
      this.operator = null
    }
  }

  setOperands(operands) {
    const isString = typeof operands === 'string'
    const candidates = isString ? operands.split('|') : Array.from(operands)
    const filtered = candidates
      .map(i => i.replace(/[^a-z0-9_\-\s]/i, '').trim())
      .filter(m => (m || []).length > 0 && /^[0-9a-z_\-]*$/i.test(m))
    this.operands = Array.from(filtered)
  }
}

export default Triplet
