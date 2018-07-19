/* eslint-env mocha */

import chai from 'chai' // eslint-disable-line

const assert = chai.assert // eslint-disable-line
const expect = chai.expect // eslint-disable-line
const should = chai.should() // eslint-disable-line

const SubjectClass = require('./triplet')

describe('types/triplet', () => {
  it('Should be an object', () => {
    const subject = new SubjectClass('Foo', 'eq', 'Bar|Baz')
    assert.isObject(subject)
  })

  it('Should be possible to instantiate without arguments, yet add them via setters', () => {
    const subject = new SubjectClass()
    expect(subject.isValid(), 'Invoking without arguments is invalid').to.equal(false)
    const fieldName = 'UniqueUserName'
    subject.setField(fieldName)
    expect(subject.field, `Field "${fieldName}" should NOT be tampered`).to.equal(
      fieldName
    )
    subject.setOperator('IN')
    expect(subject.operator, 'Operator is expected to be lowercased').to.equal('in')
    subject.setOperands('Foo|    | ')
    expect(
      subject.operands.length,
      'Although we have pipes, only "Foo" should be present'
    ).to.equal(1)
    expect(
      subject.operands.join(),
      'Although we have pipes, only "Foo" should be present'
    ).to.equal('Foo')
    expect(subject.isValid(), 'Should now be a valid triplet').to.equal(true)
  })

  it('Should be able to handle Foo_$eq_$Bar|Baz', () => {
    const subject = new SubjectClass('Foo', 'eq', 'Bar|Baz')
    expect(subject, 'field should be string Foo').to.have.property('field')
    expect(subject.field).to.equal('Foo')
    expect(subject, 'operator should be string eq').to.have.property('operator')
    expect(subject.operator).to.equal('eq')
    expect(subject, 'operands').to.have.property('operands')
    expect(subject.operands).to.include('Bar')
    expect(subject.operands).to.include('Baz')
  })

  it('Should be able to handle stringify back to Foo_$eq_$Bar|Baz', () => {
    const subject = new SubjectClass('Foo', 'eq', 'Bar|Baz')
    const stringified = subject.toString()
    expect(stringified).to.equal('Foo_$eq_$Bar|Baz')
  })

  it('Should be able to handle stringify back to Foo_$eq_$Bar|Baz', () => {
    const subject = new SubjectClass('UserName', 'eq', 'alice')
    const stringified = subject.toString()
    // console.log('UserName_$eq_$alice' === stringified) // => true
    expect(subject.field).to.equal('UserName')
    expect(subject.operator).to.equal('eq')
    expect(subject.operands[0]).to.equal('alice')
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
    'exists'
  ]
  for (const op of shouldBeValidOperators) {
    it(`Should consider "${op}" in "Foo_$${op}_$Baarr" as a VALID operator constraint`, () => {
      let subject = SubjectClass.fromString(`Foo_$${op}_$Baarr`)
      expect(subject).to.be.an.instanceof(SubjectClass)
      expect(subject.isValid()).to.equal(true)
    })
  }

  const shouldBeInvalidOperators = [
    'bogus',
    '__ne'
  ]
  for (const op of shouldBeInvalidOperators) {
    const stringified = `Foo_$${op}_$Baar`
    it(`Should consider "${op}" in "${stringified}" as an INVALID operator constraint`, () => {
      const subject = SubjectClass.fromString(stringified)
      expect(subject).to.be.an.instanceof(SubjectClass)
      expect(subject.isValid()).to.equal(false)
    })
  }

  const invalidOperands = [
    '',
    '  '
  ]
  for (const op of invalidOperands) {
    const stringified = `Foo_$eq_$${op}`
    it(`Should consider "${op}" into "${stringified}" as an INVALID operands`, () => {
      let subject = SubjectClass.fromString(stringified)
      expect(subject.isValid(), 'isValid() method should return false').to.equal(
        false
      )
      expect(
        subject.toString(),
        'toString() method should have returned an empty string'
      ).to.equal('')
    })
  }

  it('Should be possible to add, remove, edit operands', () => {
    const subject = new SubjectClass()
    subject.setField('Foo')
    subject.setOperator('in')
    subject.setOperands('REQ_SECURITYSCAN|REQ_SECURITYSCAN_MANUAL')
  })
})
