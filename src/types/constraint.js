import Triplet from './triplet'

/**
 * @bit
 * @public
 * @class
 * @name Constraint
 * @description A constraint is a collection of Triplet
 * @summary Constraint is responsible of handling all Triplet, and ensure no duplication exists
 *
 * @example
 * const q = new Constraint()
 *
 * const begin = 1529812800
 * let end = 1530417600
 * q.setFieldBetween('createdAt', begin, end)
 * q.setField('Owner', 'eq', 'Administrator')
 *
 * console.log(String(q))
 * // => 'createdAt_$gte_$1529812800,createdAt_$lte_$1530417600,Owner_$eq_$Administrator'
 *
 * // Change createdAt end date, remove Owner field
 * end += 86400 // a day later
 * q.setFieldBetween('createdAt', begin, end)
 * q.clearField('Owner')
 *
 * console.log(String(q))
 * // => 'createdAt_$gte_$1529812800,createdAt_$lte_$1530504000'
 */
class Constraint {
  /**
   * @name constructor
   *
   * Notice we might want to use constructor arguments
   * to tell what is the Array.<Triplet> separator to use when #toString (currently a coma ",")
   * and what is the Triplet field definition (currently underscore dollar "_$").
   *
   * @description Instance constructor
   *
   * @return {Constraint}
   */
  constructor () {
    // Handle constraint state.
    // definition is an two-level deep object where the first level keys are the fields
    // the second level keys are the operator used on the field
    // The value is an array of applicable operands
    // Objective is to ensure guarantee there will only be
    // one set of operands for a given pair of field and operator.
    this.definition = {}
  }

  /**
   * @property
   * @name fieldKeys
   * @description An array of Strings of all current Triplets
   * @return {Array.<String>}
   */
  get fieldKeys () {
    return Object.keys(this.definition)
  }

  /**
   * @method
   * @name getField
   * @description Return a structured representation of what could be used to create a new instance of Triplet
   *
   * @param {string} field - An identifier we want to seek matching a constraint on
   * @param {boolean} [triplet] - Toggle whether we want a copy of definition for the provided field or an Array of Triplet, default false
   *
   * @return {(Object|Array.<Triplet>)} Either an empty object, or a copy of the field representation
   */
  getField (field, triplet = false) {
    const hasField = Reflect.has(this.definition, field)
    const fieldDefinition = hasField ? Object.assign({}, this.definition[field]) : {}
    let dto = {}
    if (triplet) {
      let state = {}
      state.definition = {}
      state.definition[field] = fieldDefinition
      dto = Constraint.fromState(state).toTriplets()
    } else {
      dto = fieldDefinition
    }
    return dto
  }

  /**
   * @method
   * @name toState
   * @description Extract current state for message passing
   * @see {@link fromState}
   *
   * @return {!Object}
   */
  toState () {
    const definition = Object.assign({}, this.definition)

    return {
      definition
    }
  }

  /**
   * @method
   * @name setField
   *
   * The responsibility of this method is to change the constraint state.
   * It should be making sure only have unique members for a given field and operator pair.
   * If there is already something, overwrite it.
   *
   * @description Add/Edit a triplet from the current Constraint.
   *
   * @param {string} field - What field to seek for
   * @param {string} [operator] - What compare as, for equality, for existence in a collection, ...
   * @param {(string|Array)} [operands] - Predicates to use for the comparison statement (or Triplet)
   * @param {boolean} [clear] - Whether or not we clear any other operators and clear current field and replace with provided operands, default false
   */
  setField (field, operator = null, operands = [], clear = false) {
    const isOperandsOnlyOneNumber = Number.isNaN(operands) === false && typeof operands === 'number'
    let reorganizedOperands = isOperandsOnlyOneNumber ? [ operands.toString() ] : operands
    const tripletCandidate = new Triplet(field, operator, reorganizedOperands)
    const hasField = Reflect.has(this.definition, field)
    const isOperatorValid = typeof tripletCandidate.operator === 'string'
    // console.log(`setField(${field}, ${operator}, ...)`, isOperatorValid, isOperandsOnlyOneNumber, reorganizedOperands)
    if (clear === true || hasField === false) {
      // Which is the same effect in either case
      // Either we want the field cleard, or make sure it exists.
      this.clearField(field)
    }
    if (isOperatorValid === false) {
      // If operator isn't valid, we do not need to continue.
      return
    }
    const hasFieldOperator = !!Reflect.has(this.definition[field], operator)
    if (hasFieldOperator === false) {
      this.definition[field][operator] = []
    }
    // Watch out though, if you want to have numbers
    // In the case of #setFieldBetween, we'll have to OVERWRITE as Number
    const definition = tripletCandidate.toDefinition(/* stringifiedOperands defaults true */ false)
    // console.log('toState', definition.operands)
    this.definition[field][operator] = [...definition.operands]
    // /Handle constraint state.
  }

  /**
   * @method
   * @name clearField
   * @description clear field and replace with empty HashMap
   *
   * @param {string} field - Name of the field we want to clear
   */
  clearField (field) {
    this.definition[field] = {}
  }

  /**
   * @method
   * @name setFieldBetween
   * @description Wrapper method around #setField to create a comparison between two numbers
   *
   * @param {string} field - What field to seek for, but this time, will be creating two Triplets for AFTER begin, and BEFORE end date.
   * @param {number} begin - To compare greater or equal than
   * @param {number} end - To compare less or equal than
   */
  setFieldBetween (field, begin, end) {
    if (Number.isNaN(begin) || Number.isNaN(end)) {
      const message = 'Both the begin or the end date MUST BE Numbers'
      throw new Error(message)
    }
    // Watch out though, if you want to have numbers
    // In #setField, we get a string, but internally here we'd prefer Numbers
    // That'S why we're OVERWRITING them as Number
    this.setField(field, 'gte', begin.toString())
    this.definition[field]['gte'] = [begin]
    this.setField(field, 'lte', end.toString())
    this.definition[field]['lte'] = [end]
  }

  /**
   * @static
   * @name extractTripletsDefinition
   * @description Static method wrapping around #extractTriplets, to retrieve triplet definition
   *
   * @param {string} [notation] - Any constraint notation, separated by coma
   *
   * @return {Array.<Object>}
   */
  static extractTripletsDefinition (notation = '') {
    let collection = []
    // It is possible a string has a coma and a nested triplet.
    // Taking no chance and worse case, we have an array of one.
    const tripletStringArray = Constraint.extractTriplets(notation)
    for (const tripletString of tripletStringArray) {
      const tripletCandidate = Triplet.fromString(tripletString)
      collection.push(tripletCandidate.toDefinition(/* stringifiedOperands defaults true */))
    }
    return collection
  }

  /**
   * @static
   * @name extractTriplets
   * @description Static method to extract triplet definition from coma separated string
   *
   * @param {string} [notation] - Any constraint notation string separated by comas
   * @return {Array.<String>}
   */
  static extractTriplets (notation = '') {
    const comas = notation.split(',').filter(m => (m || []).length > 0)
    return comas.filter(m => (m.match(/(_\$)/g) || []).length === 2)
  }

  /**
   * @static
   * @name fromString
   * @description Static method to get a new instance of Constraint based on the provided notation
   *
   * @example
   * const q = Constraint.fromString('Foo_$eq_$Bar')
   *
   * console.log(String(q))
   * // => 'Foo_$eq_$Bar'
   *
   * console.log(JSON.stringify(q))
   * // => '{"definition":{"Foo":{"eq":["Bar"]}}}'
   *
   * q.setField('Account.Username', 'eq', 'jdoe')
   * console.log(String(q))
   * // => 'Foo_$eq_$Bar,Account.Username_$eq_$jdoe'
   *
   * @param {string} [notation] - Any constraint notation, separated by coma
   * @return {Constraint}
   */
  static fromString (notation = '') {
    let candidate = new Constraint()
    const definition = Constraint.extractTripletsDefinition(notation)
    for (const fieldDefinition of definition) {
      candidate.setField(fieldDefinition.field, fieldDefinition.operator, fieldDefinition.operands)
    }

    return candidate
  }

  /**
   * @method
   * @name setDefinition
   * @summary What criteria this constraint is meant to describe
   * @description Replace current constraint criteria with the provided descriptor HashMap
   *
   * @example
   * let definition = {}
   * definition.Foo = {}
   * definition.Foo.eq = ['Bar', 'Baz']
   * const q = new Constraint()
   * q.setDefinition(definition)
   *
   * console.log(String(q))
   * // => 'Foo_$eq_$Bar|Baz'
   *
   * @param {Object} [definition] - A HashMap of operator, containing an array of operands
   */
  setDefinition (definition = {}) {
    for (const [
      field,
      fieldDefinition
    ] of Object.entries(definition)) {
      for (const [
        operator,
        operands
      ] of Object.entries(fieldDefinition)) {
        // setField expect strings, no worries, itll be casted back to Number if operator matches.
        const rearrangedOperands = operands.map(String)
        this.setField(field, operator, rearrangedOperands)
      }
    }
  }

  /**
   * @static
   * @name fromState
   * @description Static method to create new instance of Constraint based on state HashMap
   *
   * @example
   * let state = {}
   * state.definition = {}
   * state.definition.Foo = {}
   * state.definition.Foo.eq = ['Bar']
   * const q = Constraint.fromState(state)
   *
   * console.log(String(q))
   * // => 'Foo_$eq_$Bar'
   *
   * @param {Object} [state] - The initial state representation HashMap
   * @param {Object} [state.definition] - A HashMap of operator as key (e.g. 'in'), where each members has an array of operands as strings
   *
   * @return {Constraint}
   */
  static fromState (state = {}) {
    const candidate = new Constraint()
    const hasDefinition = Reflect.has(state, 'definition')
    const definition = hasDefinition ? Object.assign({}, state.definition) : {}
    candidate.setDefinition(definition)

    return candidate
  }

  /**
   * @method
   * @name toTriplets
   * @description Get current Constraint state using an Array of Triplet
   *
   * @return {Array.<Triplet>}
   */
  toTriplets () {
    let triplets = []
    for (const [
      field,
      operators
    ] of Object.entries(this.definition)) {
      for (const [
        operator,
        operands
      ] of Object.entries(operators)) {
        const stringifiedOperands = operands.map(String).join('|')
        const triplet = new Triplet(field, operator, stringifiedOperands)
        triplets.push(triplet)
      }
    }

    return [ ...triplets ]
  }

  /**
   * @method
   * @name toString
   * @summary Object Interface to describe how a Constraint should be written as a simple string
   * @description Get a coma separated list of Triplets based on current state
   *
   * @return {string}
   */
  toString () {
    let triplets = this.toTriplets().filter(t => t.isValid())
    return triplets.join(',')
  }

  /**
   * @method
   * @name toJSON
   * @description Alias to #toState()
   * @summary Object Interface to describe how to serialize into JSON a Constraint
   * @see {@link toState}
   *
   * @example
   * const q = Constraint.fromString('Foo_$eq_$Bar')
   *
   * console.log(JSON.stringify(q))
   * // => '{"definition":{"Foo":{"eq":["Bar"]}}}'
   *
   * console.log(typeof JSON.stringify(q))
   * // => string
   *
   * console.log(typeof q.toJSON())
   * // => object
   *
   * @return {!Object}
   */
  toJSON () {
    const state = this.toState()
    return state
  }

  /**
   * @method
   * @name clone
   *
   * Notice that we could use a pattern similar
   * to the code snippet below.
   * But we already have a way to extract and
   * hydrate from the definition (or state).
   *
   * ```js
   * // Leverage Object.assign
   * // and Object.getPrototypeOf
   * const original = Constraint.fromString('Foo_$eq_$Bar')
   * const cloned = Object.assign(
   *   Object.create(
   *     Object.getPrototypeOf(original)
   *   ),
   *   original
   * )
   * ```
   *
   * See
   * <https://www.nickang.com/how-to-clone-class-instance-javascript>
   *
   * But in our case, we keep the state handling using the same mechanism
   * as when we do manipulation.
   *
   * @description Get a fresh copy of the current Constraint
   *
   * @example
   * const original = Constraint.fromString('Foo_$eq_$Bar')
   * const copy = original.clone()
   * copy.setField('Foo', 'eq', ['Baar'])
   *
   * console.log(original.toString())
   * // => 'Foo_$eq_$Bar'
   *
   * console.log(copy.toString())
   * // => 'Foo_$eq_$Baar'
   *
   * @return {Constraint}
   */
  clone () {
    const state = this.toState()
    const candidate = Constraint.fromState(state)
    return candidate
  }
}

export default Constraint
