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
    expect(subject.definition).toMatchSnapshot()
  })

  let expectedCharlie = 'Foo_$eq_$Bar|Baz'
  let charlie = 'Foo_$eq_$Bar|Baz,Bogus|things'
  test(`Should be able to give back "${expectedCharlie}" out of "${charlie}"`, () => {
    const subject = new SubjectClass(charlie)
    expect(subject.toString()).toBe(expectedCharlie)
    expect(subject.definition).toMatchSnapshot()
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
    expect(subject.definition).toMatchSnapshot()
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
    expect(subject.definition).toMatchSnapshot()
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

    /**
     * Constraint object should look like this;
     *
     * Tip: Within a Bitsrc workspace, with testers environment in place, look at dist/__snapshots__/ for other snapshot files
     *
     * ```js
-    * Constraint {
-    *   "definition": Object {
-    *     "CreatedDate": Object {
-    *       "gte": Array [
-    *         1529812800,
-    *       ],
-    *       "lte": Array [
-    *         1530417600,
-    *       ],
-    *     },
-    *   },
-    *   "notation": "CreatedDate_$gte_$1529812800,CreatedDate_$lte_$1530417600",
-    *   "triplets": Array [
-    *     Triplet {
-    *       "field": "CreatedDate",
-    *       "operands": Array [
-    *         "1529812800",
-    *       ],
-    *       "operator": "gte",
-    *     },
-    *     Triplet {
-    *       "field": "CreatedDate",
-    *       "operands": Array [
-    *         "1530417600",
-    *       ],
-    *       "operator": "lte",
-    *     },
-    *   ],
-    * }
     * ```
     */
    expect(subject).toMatchSnapshot()
    expect(subject.definition).toMatchSnapshot()
  })

  test('Should be possible to update fields, from both #addTriplet, and #setBetween methods', () => {
    const subject = new SubjectClass()
    const fieldName = 'CreatedDate'
    const begin = 1529812800
    const end = 1530417600
    subject.addTriplet('GroupMembership', 'in', 'admin|users|   ') // Potentially bogus, yet possible situation
    subject.setBetween(fieldName, begin, end)
    // console.log('\nConstraint before: ', subject.toString())
    expect(subject.getFieldDefinition(fieldName).lte[0]).toBe(end)
    subject.addTriplet('Foo', 'eq', 'Baar') // Mix cards, too.

    // BEFORE changing CreatedDate and GroupMembership
    expect(subject.toString()).toMatchSnapshot()

    // CHANGING CreatedDate and GroupMembership
    const laterOn = end + 86400 // a day later
    subject.setBetween(fieldName, begin, laterOn)
    subject.addTriplet('GroupMembership', 'in', 'sudoers')

    // SANITY CHECKS if our changes are applied
    expect(subject.getFieldDefinition(fieldName).lte[0]).toBe(laterOn)
    expect(subject.definition[fieldName].lte[0]).toBe(laterOn) // This needs refactor
    expect(subject.definition).toMatchSnapshot()
    expect(subject.toString()).toMatchSnapshot()
  })

  test('Internal Constraint state support partially valid Triplets', () => {
    const subject = new SubjectClass()
    subject.addTriplet('GroupMembership', 'in', '') // Deliberately incomplete
    subject.addTriplet('AssetId', 'in', '1111-2222-3333| |4444-5555-6666') // Deliberately bogus, empty, member
    // So we already have definition for the field in place, so we will be able to render form with incomplete state.
    expect(subject.getFieldDefinition('GroupMembership')).toMatchObject({in: []})
    expect(subject.definition).toMatchSnapshot()
    expect(subject).toMatchSnapshot()
    expect(subject.toString()).toEqual('AssetId_$in_$1111-2222-3333|4444-5555-6666')
  })
})
