import Triplet from './triplet'

/**
 * @bit
 * @public
 * @name types/constraint
 * @description A constraint is a collection of Triplet
 * @param {string} notation a coma separated list of Triplets represented as a string
 */
class Constraint {
  constructor(notation = '') {
    this.notation = notation
    this.triplets = []
    const extracted = Constraint.extractTriplets(notation)
    for (const possibleTriplet of extracted) {
      this.addTriplet(possibleTriplet)
    }
  }

  addTriplet(possibleTriplet) {
    const maybe = Triplet.fromString(possibleTriplet)
    if (maybe.isValid()) {
      this.triplets.push(maybe)
    }
  }

  static extractTriplets(notation = '') {
    const comas = notation.split(',').filter(m => (m || []).length > 0)
    return comas.filter(m => (m.match(/(_\$)/g) || []).length === 2)
  }

  static fromString(notation = '') {
    return new Constraint(notation)
  }

  toString() {
    let constraints = []
    for (const triplet of this.triplets) {
      constraints.push(triplet.toString())
    }
    return constraints.join(',')
  }
}

export default Constraint
