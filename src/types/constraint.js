import Triplet from './triplet'

/**
 * @bit
 * @public
 * @name types/constraint
 * @description A constraint is a collection of Triplet
 * @param {string} notation a coma separated list of Triplets represented as a string
 */
class Constraint {
  constructor (notation = '') {
    this.notation = notation
    this.constraints = Constraint.parse(notation)
  }
  static parse (notation = '') {
    // 'User_$eq_$bob,Foo_$eq_$Baar|Baz'.split(',').filter(m => m.length > 0)
    // > [ "User_$eq_$bob", "Foo_$eq_$Baar|Baz" ]
    // 'User_$eq_$bob,Foo_$eq_$Baar|Baz'.split(',').filter(m => m.length > 0).splice(1,1)
    // > [ "Foo_$eq_$Baar|Baz" ]
    const comas = notation.split(',').filter(m => (m || []).length > 0)
    const triplets = comas.filter(m => (m.match(/(_\$)/g) || []).length === 2)
    // console.log('notation, comas, triplets', {notation, comas, triplets})

    let constraints = []
    for (const t of triplets) {
      const attempt = Triplet.parse(t)
      if (attempt instanceof Triplet) {
        constraints.push(attempt)
      }
      // constraints.push(new Triplet(...t.split('_$')))
    }
    return [...constraints]
  }

  toString () {
    let constraints = []
    for (const t of this.constraints) {
      constraints.push(t.toString())
    }
    return constraints.join(',')
  }
}

export default Constraint
