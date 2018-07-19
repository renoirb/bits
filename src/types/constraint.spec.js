/* eslint-env jest */
/* global describe,beforeAll,afterAll,beforeEach,afterEach,test,expect */

require('jest') // '@bit/bit.testers.jest'

const SubjectClass = require('./constraint')
const Triplet = require('./triplet')

describe('types/constraint', () => {
  let alpha = 'Foo_$eq_$Bar|Baz,Buzz_$in_$Bizz'
  test(`Should be able to handle "${alpha}"`, () => {
    const subject = new SubjectClass(alpha)
    expect(subject).toHaveProperty('notation')
    expect(subject.notation).toBe(alpha)
    expect(subject).toHaveProperty('triplets')
    expect(subject.triplets[0]).toBeInstanceOf(Triplet)
    expect(subject.triplets.length === 2).toBe(true)
  })

  test('Should be able to return an array of Triplet', () => {
    const subject = SubjectClass.fromString('Foo_$eq_$Bar')
    expect(subject.triplets[0]).toBeInstanceOf(Triplet)
    expect(subject.triplets.length === 1).toBe(true)
    expect(subject.triplets[0].operands).toContain('Bar')
  })

  let bravo = 'Foo_$eq_$Bar,Hello_$eq_$Multiverse'
  test(`Should be able to handle "${bravo}" and stringify it back to the same thing`, () => {
    const subject = new SubjectClass(bravo)
    expect(subject.triplets[0].toString()).toBe('Foo_$eq_$Bar')
    const stringified = subject.toString()
    expect(stringified).toBe(bravo)
  })

  let expectedCharlie = 'Foo_$eq_$Bar|Baz'
  let charlie = 'Foo_$eq_$Bar|Baz,Bogus|things'
  test(`Should be able to give back "${expectedCharlie}" out of "${charlie}"`, () => {
    const subject = new SubjectClass(charlie)
    expect(subject.toString()).toBe(expectedCharlie)
  })

  test('Should be able to accept more than one operands with pipe character and numbers', () => {
    const notation = 'SomeFieldName_$in_$FOO_SOMETHING|FOO_SOMETHING_MANUAL'
    const subject = new SubjectClass(notation)
    const firstTriplet = subject.triplets[0]
    expect(firstTriplet.field).toBe('SomeFieldName')
    expect(firstTriplet.operands.length).toBe(2)
    expect(firstTriplet.toString()).toBe(notation)
    expect(subject.notation).toBe(notation)
    expect(subject.toString()).toBe(notation)
  })

  test('Should be able to replace only the matching member for the same field and operator', () => {
    const notation = 'SomeFieldName_$in_$FOO_SOMETHING|FOO_SOMETHING_MANUAL'
    const subject = new SubjectClass(notation)
    expect(subject.toString()).toBe(notation)
    expect(subject.notation).toBe(notation)
    subject.addTriplet('Status', 'eq', 'Successful')
    subject.addTriplet('SomeFieldName', 'in', 'Something_Different')
    // Also make sure #toString() is still in sync with #notation
    expect(subject.toString()).toBe('SomeFieldName_$in_$Something_Different,Status_$eq_$Successful')
    expect(subject.notation).toBe('SomeFieldName_$in_$Something_Different,Status_$eq_$Successful')
  })

  test('Should be able to handle a Date Range between two UNIX Epoch', () => {
    const subject = new SubjectClass()
    const fieldName = 'CreatedDate'
    const begin = 1529812800
    const end = 1530417600
    subject.setBetween(fieldName, begin, end)
    expect(subject.triplets[0].operands[0]).toBe(begin.toString())
    expect(subject.triplets[1].operands[0]).toBe(end.toString())
    let expected = 'CreatedDate_$gte_$'
    expected += begin
    expected += ',CreatedDate_$lte_$'
    expected += end
    expect(subject.toString()).toBe(expected)
    expect(subject.notation).toBe(expected)
    expect(subject.fields).toContain(fieldName)
    expect(subject.getFieldDefinition(fieldName).gte[0]).toBe(begin)
  })

  test('Should be possible to update a Date Range', () => {
    const subject = new SubjectClass()
    const fieldName = 'CreatedDate'
    const begin = 1529812800
    const end = 1530417600
    subject.addTriplet('GroupMembership', 'in', 'admin|users|   ') // Potentially bogus, yet possible situation
    subject.setBetween(fieldName, begin, end)
    // console.log('\nConstraint before: ', subject.toString())
    expect(subject.getFieldDefinition(fieldName).lte[0]).toBe(end)
    subject.addTriplet('Foo', 'eq', 'Baar') // Mix cards, too.
    const laterOn = end + 86400 // a day later
    subject.setBetween(fieldName, begin, laterOn)
    // console.log('\nConstraint after: ', subject.toString(), '\nend: ', end, '\nlaterOn: ', laterOn)
  })
})
