/* eslint-env jest */
/* global describe,beforeAll,afterAll,beforeEach,afterEach,test,expect */

require('jest') // '@bit/bit.testers.jest'

const SubjectClass = require('./triplet')

describe('types/triplet', () => {
  test('Should be possible to instantiate without arguments, yet add them via setters', () => {
    const subject = new SubjectClass()
    expect(subject.isValid()).toBe(false)
    const fieldName = 'UniqueUserName'
    subject.setField(fieldName)
    expect(subject.field).toBe(fieldName)
    subject.setOperator('IN')
    expect(subject.operator).toBe('in')
    subject.setOperands('Foo|    | ')
    expect(subject.operands.length).toBe(1)
    expect(subject.operands.join()).toBe('Foo')
    expect(subject.isValid()).toBe(true)
  })

  test('Should be able to handle Foo_$eq_$Bar|Baz', () => {
    const subject = new SubjectClass('Foo', 'eq', 'Bar|Baz')
    expect(subject).toHaveProperty('field')
    expect(subject.field).toBe('Foo')
    expect(subject).toHaveProperty('operator')
    expect(subject.operator).toBe('eq')
    expect(subject).toHaveProperty('operands')
    expect(subject.operands).toContain('Bar')
    expect(subject.operands).toContain('Baz')
  })

  test('Should be able to handle stringify back to Foo_$eq_$Bar|Baz', () => {
    const subject = new SubjectClass('Foo', 'eq', 'Bar|Baz')
    const stringified = subject.toString()
    expect(stringified).toBe('Foo_$eq_$Bar|Baz')
  })

  test('Should be able to handle stringify back to Foo_$eq_$Bar|Baz', () => {
    const subject = new SubjectClass('UserName', 'eq', 'alice')
    const stringified = subject.toString()
    // console.log('UserName_$eq_$alice' === stringified) // => true
    expect(subject.field).toBe('UserName')
    expect(subject.operator).toBe('eq')
    expect(subject.operands[0]).toBe('alice')
    expect(stringified).toBe('UserName_$eq_$alice')
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
    test(`Should consider "${op}" in "Foo_$${op}_$Baarr" as a VALID operator constraint`, () => {
      let subject = SubjectClass.fromString(`Foo_$${op}_$Baarr`)
      expect(subject).toBeInstanceOf(SubjectClass)
      expect(subject.isValid()).toBe(true)
    })
  }

  const shouldBeInvalidOperators = [
    'bogus',
    '__ne'
  ]
  for (const op of shouldBeInvalidOperators) {
    const stringified = `Foo_$${op}_$Baar`
    test(`Should consider "${op}" in "${stringified}" as an INVALID operator constraint`, () => {
      const subject = SubjectClass.fromString(stringified)
      expect(subject).toBeInstanceOf(SubjectClass)
      expect(subject.isValid()).toBe(false)
    })
  }

  const invalidOperands = [
    '',
    '  '
  ]
  for (const op of invalidOperands) {
    const stringified = `Foo_$eq_$${op}`
    test(`Should consider "${op}" into "${stringified}" as an INVALID operands`, () => {
      let subject = SubjectClass.fromString(stringified)
      expect(subject.isValid()).toBe(false)
      expect(subject.toString()).toBe('')
    })
  }

  test('Should be possible to add, remove, edit operands', () => {
    const subject = new SubjectClass()
    subject.setField('Foo')
    subject.setOperator('in')
    subject.setOperands('REQ_SECURITYSCAN|REQ_SECURITYSCAN_MANUAL')
  })
})
