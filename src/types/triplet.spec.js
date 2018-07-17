/* eslint-env mocha */

import chai from 'chai' // eslint-disable-line

const assert = chai.assert // eslint-disable-line
const expect = chai.expect // eslint-disable-line
const should = chai.should() // eslint-disable-line

const SubjectClass = require('./triplet')

describe('types/triplet', () => {
  it('Should be an object', () => {
    const i = new SubjectClass('Foo', 'eq', 'Bar|Baz')
    assert.isObject(i)
  })

  it('Should be possible to instantiate without arguments, yet add them via setters', () => {
    const i = new SubjectClass()
    expect(i.isValid(), 'Invoking without arguments is invalid').to.equal(false)
    const fieldName = 'UniqueUserName'
    i.setField(fieldName)
    expect(i.field, `Field "${fieldName}" should NOT be tampered`).to.equal(
      fieldName,
    )
    i.setOperator('IN')
    expect(i.operator, 'Operator is expected to be lowercased').to.equal('in')
    i.setOperands('Foo|    | ')
    expect(
      i.operands.length,
      'Although we have pipes, only "Foo" should be present',
    ).to.equal(1)
    expect(
      i.operands.join(),
      'Although we have pipes, only "Foo" should be present',
    ).to.equal('Foo')
    expect(i.isValid(), 'Should now be a valid triplet').to.equal(true)
  })

  it('Should be able to handle Foo_$eq_$Bar|Baz', () => {
    const i = new SubjectClass('Foo', 'eq', 'Bar|Baz')
    expect(i, 'field should be string Foo').to.have.property('field')
    expect(i.field).to.equal('Foo')
    expect(i, 'operator should be string eq').to.have.property('operator')
    expect(i.operator).to.equal('eq')
    expect(i, 'operands').to.have.property('operands')
    expect(i.operands).to.include('Bar')
    expect(i.operands).to.include('Baz')
  })

  it('Should be able to handle stringify back to Foo_$eq_$Bar|Baz', () => {
    const i = new SubjectClass('Foo', 'eq', 'Bar|Baz')
    const stringified = i.toString()
    expect(stringified).to.equal('Foo_$eq_$Bar|Baz')
  })

  it('Should be able to handle stringify back to Foo_$eq_$Bar|Baz', () => {
    const i = new SubjectClass('UserName', 'eq', 'alice')
    const stringified = i.toString()
    // console.log('UserName_$eq_$alice' === stringified) // => true
    expect(i.field).to.equal('UserName')
    expect(i.operator).to.equal('eq')
    expect(i.operands[0]).to.equal('alice')
    expect(stringified).to.equal('UserName_$eq_$alice')
  })

  const shouldBeValidOperators = [
    'eq',
    'ne',
    'lt',
    'lte',
    'gt',
    'gte',
    'in',
    'nin',
    'all',
    'exists',
  ]
  for (const op of shouldBeValidOperators) {
    it(`Should consider "${op}" in "Foo_\$${op}_\$Baarr" as a VALID operator constraint`, () => {
      let i = SubjectClass.fromString(`Foo_\$${op}_\$Baarr`)
      expect(i).to.be.an.instanceof(SubjectClass)
      expect(i.isValid()).to.equal(true)
    })
  }

  const shouldBeInvalidOperators = ['bogus', '__ne']
  for (const op of shouldBeInvalidOperators) {
    const stringified = `Foo_\$${op}_\$Baar`
    it(`Should consider "${op}" in "${stringified}" as an INVALID operator constraint`, () => {
      const i = SubjectClass.fromString(stringified)
      expect(i).to.be.an.instanceof(SubjectClass)
      expect(i.isValid()).to.equal(false)
    })
  }

  const invalidOperands = ['', '  ']
  for (const op of invalidOperands) {
    const stringified = `Foo_\$eq_\$${op}`
    it(`Should consider "${op}" into "${stringified}" as an INVALID operands`, () => {
      let i = SubjectClass.fromString(stringified)
      expect(i.isValid(), 'isValid() method should return false').to.equal(
        false,
      )
      expect(
        i.toString(),
        'toString() method should have returned an empty string',
      ).to.equal('')
    })
  }
})
