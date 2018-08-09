/* eslint-env jest */
/* global describe,beforeAll,afterAll,beforeEach,afterEach,test,expect */

require('jest') // '@bit/bit.testers.jest'

const SubjectClass = require('./constraint')
const Triplet = require('./triplet')

describe('types/constraint', () => {
  const inputNotationAllValid = 'Foo_$in_$Bar|Baz,Buzz_$in_$Bizz'
  const inputNotationWithIncomplete = 'Foo_$in_$Bar|Baz,Buz_$eq_$'
  const expectedNotationWithIncomplete = 'Foo_$in_$Bar|Baz'
  const inputNotationWithBogus = 'Foo_$in_$Bar|  |Baz| ,Bogus|things,Fee_#Fhi_$Foe'
  const expectedNotationWithBogus = 'Foo_$in_$Bar|Baz'
  const inputNotationWithSpaceAndDotInField = 'Some Field.Name_$in_$FOO'
  const expectedNotationWithSpaceAndDotInField = 'SomeField.Name_$in_$FOO'
  const inputNotationAdditiveWithEmail = 'Accounts.Username_$in_$root@example.org'
  const expectedNotationAdditiveWithEmail = expectedNotationWithSpaceAndDotInField + ',' + inputNotationAdditiveWithEmail

  test(`Instance methods/properties`, () => {
    const subject = SubjectClass.fromString(inputNotationAllValid)

    expect(subject).toHaveProperty('definition')
    // #toString() method so we can type cast Constraint as a formatted string
    expect(subject).toHaveProperty('toString')
    // #toJSON() method so we can export the state, to persist elsewhere
    expect(subject).toHaveProperty('toJSON')
    // #fieldKeys property to know which fields are part of the Constraint
    expect(subject).toHaveProperty('fieldKeys')
    // #toTriplets() method so we can pass directly to Vue components
    expect(subject).toHaveProperty('toTriplets')
    // #clearField method so we can remove previously set definition
    expect(subject).toHaveProperty('clearField')
  })

  test(`Scenario 1: #fromString() Should be able to handle "${inputNotationAllValid}"`, () => {
    const subject = SubjectClass.fromString(inputNotationAllValid)

    // e.g. 'Foo_$in_$Bar|Baz,Buzz_$in_$Bizz'
    expect(String(subject)).toBe(inputNotationAllValid)
    // Notice Foo and Buzz, when we split the string, by coma
    expect(subject.fieldKeys).toMatchObject(['Foo', 'Buzz'])

    // Get as a Description HashMap Object
    let triplets = subject.getField('Foo')
    expect(triplets).toMatchObject({in: ['Bar', 'Baz']})

    // Get as an Array of Triplet
    triplets = subject.getField('Foo', true)
    const expectedTriplets = [
      new Triplet('Foo', 'in', ['Bar', 'Baz'])
    ]
    expect(triplets).toMatchObject(expectedTriplets)
    expect(triplets[0]).toBeInstanceOf(Triplet)

    // Snapshot states at the end, to help debugging.
    // Tip: Within a BitSrc workspace, with testers environment in place,
    //      look at dist/__snapshots__/ for snapshot files
    // expect(subject).toMatchSnapshot()
    // expect(subject.toTriplets()).toMatchSnapshot()
  })

  test('Scenario 2: #fromString() Should be able to recover a workable collection of Triplet, yet #toString() return fully defined Triplets only', () => {
    const subject = SubjectClass.fromString('Foo_$in_$Bar|Baz,Buz_$eq_$')

    let field = subject.getField('Foo')
    expect(field).toMatchObject({in: ['Bar', 'Baz']})
    field = subject.getField('Buz')
    expect(field).toMatchObject({eq: []})

    let triplets = subject.getField('Buz', true)
    const expectedTriplets = [
      new Triplet('Buz', 'eq')
    ]
    expect(triplets).toMatchObject(expectedTriplets)
    expect(triplets[0]).toBeInstanceOf(Triplet)

    const expectedString = expectedNotationWithBogus
    expect(String(subject)).toBe(expectedString)

    // expect(subject).toMatchSnapshot()
    // expect(subject.toTriplets()).toMatchSnapshot()
  })

  test('Scenario 3: #setDefinition() Should be able to recover a workable collection of Triplet, yet #toString() return fully defined Triplets only', () => {
    // Reproduce inputNotationWithIncomplete using Object notation
    // e.g. "Foo_$in_$Bar|Baz,Buz_$eq_$"
    const definition = {}
    definition.Foo = {}
    definition.Foo.in = ['Bar', 'Baz']
    definition.Buz = {}
    definition.Buz.eq = []

    const subject = new SubjectClass()
    subject.setDefinition(definition)

    let field = subject.getField('Foo')
    expect(field).toMatchObject({in: ['Bar', 'Baz']})
    field = subject.getField('Buz')
    expect(field).toMatchObject({eq: []})

    let triplets = subject.getField('Buz', true)
    const expectedTriplets = [
      new Triplet('Buz', 'eq')
    ]
    expect(triplets).toMatchObject(expectedTriplets)
    expect(triplets[0]).toBeInstanceOf(Triplet)

    const expectedString = expectedNotationWithIncomplete
    expect(String(subject)).toBe(expectedString)

    // expect(subject).toMatchSnapshot()
    // expect(subject.toTriplets()).toMatchSnapshot()
  })

  test('Scenario 4: #fromString() hydrated Constraint instance should be exportable through #toState(), and be idempotent when creating new instance using #fromState', () => {
    const original = SubjectClass.fromString(inputNotationWithIncomplete)
    const state = original.toState()
    const subject = SubjectClass.fromState(state)

    let field = subject.getField('Foo')
    expect(field).toMatchObject({in: ['Bar', 'Baz']})
    field = subject.getField('Buz')
    expect(field).toMatchObject({eq: []})

    let triplets = subject.getField('Buz', true)
    const expectedTriplets = [
      new Triplet('Buz', 'eq')
    ]
    expect(triplets).toMatchObject(expectedTriplets)
    expect(triplets[0]).toBeInstanceOf(Triplet)

    const expectedString = expectedNotationWithIncomplete
    expect(String(subject)).toBe(expectedString)

    // expect(subject).toMatchSnapshot()
    // expect(subject.toTriplets()).toMatchSnapshot()
  })

  test(`Scenario 5: #toString() Should give back only "${expectedNotationWithBogus}" out of bogus "${inputNotationWithBogus}"`, () => {
    const subject = SubjectClass.fromString(inputNotationWithBogus)

    const expectedString = expectedNotationWithIncomplete
    expect(String(subject)).toBe(expectedString)

    // expect(subject).toMatchSnapshot()
    // expect(subject.toTriplets()).toMatchSnapshot()
  })

  test(`Scenario 6: #toTriplets() Should give back only "${expectedNotationWithBogus}" out of bogus "${inputNotationWithBogus}"`, () => {
    const subject = SubjectClass.fromString(inputNotationWithBogus)

    let field = subject.getField('Foo')
    expect(field).toMatchObject({in: ['Bar', 'Baz']})

    // So that we know if we only have one valid triplet, regardless
    // of if we call only that one field or #toTriplets(), we get the same.
    let triplets = subject.getField('Foo', true)
    const expectedTriplets = [
      new Triplet('Foo', 'in', ['Bar', 'Baz'])
    ]
    expect(triplets).toMatchObject(expectedTriplets)
    expect(subject.toTriplets()).toMatchObject(expectedTriplets)
    expect(triplets[0]).toBeInstanceOf(Triplet)

    // expect(subject).toMatchSnapshot()
    // expect(subject.toTriplets()).toMatchSnapshot()
  })

  test(`Scenario 7: #clone() Should give a fully cloned copy of an existing Constraint instance`, () => {
    const subject = SubjectClass.fromString(inputNotationWithBogus)
    const cloned = subject.clone()

    const expectedString = expectedNotationWithBogus
    expect(String(subject)).toBe(expectedString)
    expect(String(cloned)).toBe(expectedString)

    cloned.setField('Foo', 'in', 'Quux')
    expect(String(cloned)).toBe('Foo_$in_$Quux')
    cloned.setField('Foo', 'nin', ['Quux', 'Bert'], true) // Q*Bert reference (yup!)
    cloned.setField('Bar', 'eq', 'Baz') // Add another field
    expect(String(cloned)).toBe('Foo_$nin_$Quux|Bert,Bar_$eq_$Baz')
    cloned.setField('Bar', 'nin', '', true) // Replace (notice 4th argument) with empty

    const expectedTriplets = [
      new Triplet('Foo', 'nin', ['Quux', 'Bert']),
      new Triplet('Bar', 'nin')
    ]
    expect(cloned.toTriplets()).toMatchObject(expectedTriplets)
    expect(String(cloned)).toBe('Foo_$nin_$Quux|Bert')

    // expect(subject).toMatchSnapshot()
    // expect(subject.toTriplets()).toMatchSnapshot()
  })

  test('Scenario 8: #setField(fieldName, ...) fieldName can contain dots', () => {
    const fieldName = 'SomeFieldName.NestedPath.Services'
    const notation = fieldName + '_$in_$FOO_SOMETHING|FOO_SOMETHING_ELSE'
    const subject = SubjectClass.fromString(notation)

    expect(String(subject)).toBe(notation)

    const expectedTriplets = [
      new Triplet(fieldName, 'in', 'FOO_SOMETHING|FOO_SOMETHING_ELSE')
    ]
    expect(subject.toTriplets()).toMatchObject(expectedTriplets)
    expect(subject.getField(fieldName, true)).toMatchObject(expectedTriplets)

    // expect(subject).toMatchSnapshot()
    // expect(subject.toTriplets()).toMatchSnapshot()
  })

  test(`Scenario 9: #setField() field part in "${inputNotationWithSpaceAndDotInField}" should have spaces removed, like "${expectedNotationWithSpaceAndDotInField}"`, () => {
    const subject = SubjectClass.fromString(inputNotationWithSpaceAndDotInField)
    expect(String(subject)).toBe(expectedNotationWithSpaceAndDotInField)
    // expect(subject).toMatchSnapshot()
    // expect(subject.toTriplets()).toMatchSnapshot()
  })

  test('Scenario 10: #setField("Foo", "eq", operandsString) operandsString can contain space', () => {
    const subject = new SubjectClass()

    const fieldName = 'Foo'
    const operator = 'eq'
    // Notice the dash, it might be useful too!
    // e.g. '1111-2222-3333'
    const operandsString = 'Dashed-Operand String With Spaces'
    subject.setField(fieldName, operator, operandsString)

    // And we can re-define the same field, and add a new member ...
    subject.setField(fieldName, operator, [operandsString, 'Bar'])

    // And we can re-define the same field, (contd.)
    // We know that Bar will be last of expectedString, monkey-patch to illustrate.
    const expectedString = 'Foo_$eq_$Dashed-Operand String With Spaces'
    expect(String(subject)).toBe(expectedString + '|Bar')

    // expect(subject).toMatchSnapshot()
    // expect(subject.toTriplets()).toMatchSnapshot()
  })

  test('Scenario 11: #setField("GroupMembership", "in", operandsString) operandsString gets only non empty strings', () => {
    const subject = new SubjectClass()

    const fieldName = 'GroupMembership'
    const operator = 'in'
    const operandsString = 'admin|users| |  '

    subject.setField(fieldName, operator, operandsString)
    expect(subject.getField(fieldName)).toMatchObject({in: ['admin', 'users']})

    const expectedString = fieldName + '_$' + operator + '_$' + 'admin|users'
    expect(String(subject)).toBe(expectedString)

    // expect(subject).toMatchSnapshot()
    // expect(subject.toTriplets()).toMatchSnapshot()
  })

  test('Scenario 12: #setFieldBetween() Should be able to handle a Date Range between two UNIX Epoch and update values', () => {
    const subject = new SubjectClass()

    const fieldName = 'CreatedDate'
    const begin = 1529812800
    let end = 1530417600
    const previousEnd = end // String, passed as a copy.

    subject.setFieldBetween(fieldName, begin, end)
    // expect(subject.toTriplets()).toMatchSnapshot() // BEFORE Changing

    let field = subject.getField(fieldName)
    expect(field.gte[0]).toBe(begin)
    expect(field.lte[0]).toBe(end)

    let expectedString = 'CreatedDate_$gte_$'
    expectedString += begin
    expectedString += ',CreatedDate_$lte_$'
    expect(String(subject)).toBe(expectedString + end)

    end += 86400 // a day later
    subject.setFieldBetween(fieldName, begin, end)
    expect(previousEnd + 86400).toBe(end)
    // expect(subject.toTriplets()).toMatchSnapshot() // AFTER Changing

    field = subject.getField(fieldName)
    expect(field.lte[0]).toBe(end)
    expect(String(subject)).toBe(expectedString + end)
  })

  test(`Scenario 13: #toJSON() Should serialize and work with JSON.stringify(), it also should give back only "${expectedNotationWithBogus}" out of bogus "${inputNotationWithBogus}"`, () => {
    const subject = SubjectClass.fromString(inputNotationWithBogus)

    let state = {}
    state.definition = {}
    state.definition.Foo = {}
    state.definition.Foo.in = ['Bar', 'Baz']
    const expectedJson = JSON.stringify(state)
    // => "{\\"definition\\":{\\"Foo\\":{\\"in\\":[\\"Bar\\",\\"Baz\\"]}}}"

    expect(JSON.stringify(subject)).toBe(expectedJson)
    // toJSON are toState are currently expected to be idempotent.
    expect(subject.toJSON()).toMatchObject(state)
    expect(subject.toState()).toMatchObject(state)

    expect(JSON.stringify(subject)).toMatchSnapshot()

    // expect(subject).toMatchSnapshot()
    // expect(subject.toTriplets()).toMatchSnapshot()
  })

  test('Scenario 14: #setField("Car.Colors", "in", ["red","blue"], true), we should be able to change "in" to another "nin" and keep same values', () => {
    const subject = new SubjectClass()

    const fieldName = 'Car.Colors'
    const operator = 'in'
    const operands = ['red', 'blue']

    subject.setField(fieldName, operator, operands)
    expect(String(subject)).toEqual('Car.Colors_$in_$red|blue')

    subject.setField(fieldName, 'nin', operands, true)
    expect(String(subject)).toEqual('Car.Colors_$nin_$red|blue')
    expect(subject.getField(fieldName)).toMatchObject({nin: operands})

    // expect(subject).toMatchSnapshot()
    // expect(subject.toTriplets()).toMatchSnapshot()
  })

  test('Scenario 15: #setField(field, operator, operands) where operands is ALWAYS a Number when operator is (lte?|gte?) (e.g. lt, lte, ...), regardless whether or not operands param is a String or a Number', () => {
    const subject = new SubjectClass()

    subject.setField('Foo', 'lt', 123)
    subject.setField('Bar', 'lte', '456')

    // BEGIN Even though this is MOST UNLILELY. ------
    // subject.setField('Baz', 'gt', [456])
    // subject.setField('Buzz', 'gte', ['456'])
    subject.setField('Bizz', 'lt', '123|456')
    subject.setField('Quux', 'gte', ['123', '456']) // Even though this is MOST UNLILELY.
    // END Even though this is MOST UNLILELY. ------

    // expect(String(subject)).toEqual('Foo_$lt_$123,Bar_$lte_$456,Baz_$gt_$456,Buzz_$gte_$456,Bizz_$lt_$123|456,Quux_$gte_$123|456')
    expect(String(subject)).toEqual('Foo_$lt_$123,Bar_$lte_$456,Bizz_$lt_$123|456,Quux_$gte_$123|456')

    // expect(subject).toMatchSnapshot()
    // expect(subject.toTriplets()).toMatchSnapshot()
  })

  test('Scenario 15: Additive that has email', () => {
    const subject = SubjectClass.fromString(expectedNotationWithSpaceAndDotInField)
    const additive = SubjectClass.fromString(inputNotationAdditiveWithEmail)
    const triplet = additive.toTriplets()[0]
    subject.setField(triplet.field, triplet.operator, triplet.operands)
    expect(String(subject)).toEqual(expectedNotationAdditiveWithEmail)
  })
})
