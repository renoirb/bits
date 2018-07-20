/**
 * @bit
 * @public
 * @class
 * @name Triplet
 * @package bindings
 * @description A Triplet consist of a set of 3 elements; a field, an operator and an operand that is a pipe separated list of strings
 * @summary A triplet is ONE element, a description of what field to compare logically with what operator for given criteria
 *
 * @example
 * const stmt = new Triplet('UserName', 'eq', 'alice')
 * console.log('UserName_$eq_$alice' === stmt.toString()) // => true
 * console.log(stmt.field) // => 'UserName'
 * console.log(stmt.operator) // => 'eq'
 * console.log(stmt.operands[0]).to.equal('alice')
 */
class Triplet {
  /**
   * @name constructor
   * @param {string} field a field name
   * @param {string} operator an operator, e.g. in, nin, eq, neq, lt, gt
   * @param {string} operands a string with pipe separated list of values to filter about using specified operator on given field
   * @return {Triplet}
   */
  constructor (field = null, operator = null, operands = '') {
    this.setField(field)
    this.setOperator(operator)
    this.setOperands(operands)
  }

  /**
   * @static
   * @name operatorRegEx
   * @description What are valid logical comparison operators
   * @return {RegExp}
   */
  static get operatorRegEx () {
    // eq|ne|lt|lte|gt|gte|in|nin|all|exists|regex
    return /^(eq|ne|lte?|gte?|n?in|all|exists|regex)$/i
  }

  /**
   * @static
   * @name fromString
   * @description Parse the current triplet, make sure this method ONLY contains ONE triplet, no comas allowed.
   * @param {string} e.g. Foo_$eq_$Bar,Baz_$in_$Buzz|Bizz
   * @return {Triplet}
   */
  static fromString (notation = '') {
    if (notation.includes(',')) {
      const message = `Invalid notation ("${notation}"), a Triplet cannot have a coma`
      throw new Error(message)
    }
    const splitter = notation.match(/(_\$)/g) || []
    const hasTwo = splitter.length === 2
    if (hasTwo) {
      const [
        field,
        operator,
        operands = ''
      ] = notation.split('_$')
      return new Triplet(field, operator, operands)
    }
    return new Triplet()
  }

  /**
   * @method
   * @name isValid
   * @description Check if we have at least a field, an operator, and at least something in operands.
   * @return {boolean} Whether the Triplet is valid or not
   */
  isValid () {
    const hasField = typeof this.field === 'string'
    const hasOperator = typeof this.operator === 'string'
    const hasOperands = this.operands.length > 0
    return (
      (hasField === false || hasOperator === false || hasOperands === false) ===
      false
    )
  }

  toDefinition (stringifiedOperands = true) {
    let args = (({ field, operator, operands }) => ({ field, operator, operands }))(this)
    if (stringifiedOperands === true) {
      const operands = args.operands.join('|')
      args.operands = operands
    }
    return args
  }

  /**
   * @method
   * @name toString
   * @description Make a string representation of the current triplet, opposite of Triplet#fromString
   * @return {string} a representation of the validated triplet statement
   */
  toString () {
    if (this.isValid() === false) {
      return ''
    }
    let triplet = []
    triplet.push(this.field)
    triplet.push(this.operator)
    triplet.push(this.operands.join('|'))
    return triplet.join('_$')
  }

  /**
   * @method
   * @name setField
   * @description What field name to use
   * @param {string} field e.g. UserName, for UserName_$eq_$root
   */
  setField (field) {
    const fieldIsString = typeof field === 'string'
    const candidate = fieldIsString ? field.replace(/[^a-z0-9\s]/i, '') : null
    this.field = candidate
  }

  /**
   * @method
   * @name setOperator
   * @description What comparison to use, for equality, is included in, etc.
   * @param {string} operator e.g. eq, for UserName_$eq_$root
   */
  setOperator (operator) {
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

  /**
   * @method
   * @name setOperands
   * @description What are the values we want to compare against
   * @param {string} operands A Pipe Separated list (e.g. Foo|Bar)
   */
  setOperands (operands) {
    const isString = typeof operands === 'string'
    const candidates = isString ? operands.split('|') : Array.from(operands)
    const filtered = candidates
      .map(i => i.replace(/[^a-z0-9_\-\s]/i, '').trim())
      .filter(m => (m || []).length > 0 && /^[0-9a-z_-]*$/i.test(m))
    this.operands = Array.from(filtered)
  }
}

export default Triplet
