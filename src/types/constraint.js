import Triplet from './triplet'

/**
 * @bit
 * @public
 * @class
 * @name Constraint
 * @package bindings
 * @description A constraint is a collection of Triplet
 * @summary Constraint is responsible of handling all Triplet, and ensure no duplication exists
 *
 * @example
 * const filter = new Constraint()
 * const begin = 1530417600
 * const end = 1530417600
 * filter.setBetween('createdAt', begin, end)
 * filter.addTriplet('Owner', 'eq', 'Administrator')
 * console.log(filter.toString())
 * // > createdAt_$gte_$1529812800,createdAt_$lte_$1530417600,Owner_$eq_$Administrator
 * filter.setBetween('createdAt', begin, end + 86400) // End date change to a day later
 * // > createdAt_$gte_$1529812800,createdAt_$lte_$1530504000,Owner_$eq_$Administrator
 */
class Constraint {
  /**
   * @name constructor
   * @param {string} notation a coma separated list of Triplets represented as a string
   * @return {Constraint}
   */
  constructor (notation = '') {
    this.notation = notation
    this.triplets = []

    // Handle constraint state.
    // items is an two-level deep object where the first level keys are the fields
    // the second level keys are the operator used on the field
    // The value is an array of applicable operands
    // Objective is to ensure guarantee there will only be
    // one set of operands for a given pair of field and operator.

    // items.CreatedAt.gte // => [ 1529812800 ]
    // items.CreatedAt.lte // => [ 1530417600 ]
    // items.GroupMemberships.in // => [ 'root', 'wheel' ]
    this.items = {}
    const parsed = Constraint.extractTripletsDefinition(notation)
    for (const dfn of parsed) {
      this.addTriplet(dfn.field, dfn.operator, dfn.operands)
    }
  }

  /**
   * @property
   * @name fields
   * @description An array of Strings of all current Triplets
   * @return {Array.<String>}
   */
  get fields () {
    return Object.keys(this.items)
  }

  /**
   * @method
   * @name getFieldDefinition
   * @description Return a structured representation of what could be used to create a new instance of Triplet
   *
   * @param {string} field
   * @return {object} Either an empty object, or a copy of the field representation
   */
  getFieldDefinition (field) {
    const exists = Reflect.has(this.items, field)
    if (exists === false) {
      return {}
    }
    return {...this.items[field]}
  }

  /**
   * @method
   * @name addTriplet
   * @description Add/Edit a triplet from the current Constraint.
   *
   * The responsibility of this method is to change the constraint state.
   * It should be making sure only have unique members for a given field and operator pair.
   * If there is already something, overwrite it.
   *
   * @param {string} field What field to seek for
   * @param {string} operator What compare as
   * @param {string} operands Predicates to use for the comparison statement (or Triplet)
   */
  addTriplet (field, operator, operands) {
    const maybe = new Triplet(field, operator, operands)
    if (maybe.isValid()) {
      const hasField = Reflect.has(this.items, field)
      if (hasField === false) {
        this.items[field] = {}
      } else {
        // We got an item, it is likely in need to be removed from the triplets array
        // var field = 'Foo', operator = 'gt', items = ['Foo_$lt_$10', 'Shou_$bi_$Dou', 'Bogus_$eq_$Bogue', 'Foo_$gt_$20'];
        // items.findIndex(s => RegExp('^'+field+'_\\$'+operator).test(s))
        const foundIndex = this.triplets.findIndex(s => RegExp('^' + field + '_\\$' + operator).test(s))
        // const item = this.triplets[foundIndex].toString()
        // console.log('One existed', foundIndex, item)
        delete this.triplets[foundIndex]
      }
      const hasFieldOperator = !!Reflect.has(this.items[field], operator)
      if (hasFieldOperator === false) {
        this.items[field][operator] = []
      }
      // Watch out though, if you want to have numbers
      // In the case of #setBetween, we'll have to OVERWRITE as Number
      const definition = maybe.toDefinition(/* stringifiedOperands defaults true */ false)
      this.items[field][operator] = [...definition.operands]
      // /Handle constraint state.

      this.triplets.push(maybe) // REMOVE ME!
      this.notation = this.toString() // REMOVE ME!
    }
  }

  /**
   * @method
   * @name setBetween
   * @description Wrapper method around #addTriplet to create a comparison between two numbers
   *
   * @param {string} field What field to seek for, but this time, will be creating two Triplets for AFTER begin, and BEFORE end date.
   * @param {number} begin to compare greater or equal than
   * @param {number} end to compare less or equal than
   */
  setBetween (field, begin, end) {
    if (Number.isNaN(begin) || Number.isNaN(end)) {
      const message = 'Both the begin or the end date MUST BE Numbers'
      throw new Error(message)
    }
    // Watch out though, if you want to have numbers
    // In #addTriplet, we get a string, but internally here we'd prefer Numbers
    // That'S why we're OVERWRITING them as Number
    this.addTriplet(field, 'gte', begin.toString())
    this.items[field]['gte'] = [begin]
    this.addTriplet(field, 'lte', end.toString())
    this.items[field]['lte'] = [end]
  }

  /**
   * @static
   * @name extractTripletsDefinition
   * @description Wrapper method around #extractTriplets, but to retrieve triplet definitions.
   *
   * @param {string} notation Any constraint notation, separated by coma
   */
  static extractTripletsDefinition (notation = '') {
    let definitions = []
    // It is possible a string has a coma and a nested triplet.
    // Taking no chance and worse case, we have an array of one.
    const notations = Constraint.extractTriplets(notation)
    for (const notation of notations) {
      const maybe = Triplet.fromString(notation)
      if (maybe.isValid()) {
        definitions.push(maybe.toDefinition(/* stringifiedOperands defaults true */))
      }
    }
    return definitions
  }

  /**
   * @static
   * @name extractTriplets
   * @description Extract triplets from coma separated string
   * @param {string} notation  Any constraint notation, separated by coma
   * @return {Array.<String>}
   */
  static extractTriplets (notation = '') {
    const comas = notation.split(',').filter(m => (m || []).length > 0)
    return comas.filter(m => (m.match(/(_\$)/g) || []).length === 2)
  }

  /**
   * @static
   * @name fromString
   * @description Returns new instance of Constraint
   * @see {@link constructor}
   */
  static fromString (notation = '') {
    return new Constraint(notation)
  }

  /**
   * @method
   * @name toString
   * @description Get a coma separated list of Triplets based on current state
   */
  toString () {
    let triplets = []
    for (const [ field, operators ] of Object.entries(this.items)) {
      for (const [ operator, operands ] of Object.entries(operators)) {
        const stringifiedOperands = operands.map(String).join('|')
        const triplet = new Triplet(field, operator, stringifiedOperands)
        if (triplet.isValid()) {
          triplets.push(triplet.toString())
        }
      }
    }

    return triplets.join(',')
  }
}

export default Constraint
