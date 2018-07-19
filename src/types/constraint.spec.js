/* eslint-env mocha */

import chai from 'chai' // eslint-disable-line

const assert = chai.assert // eslint-disable-line
const expect = chai.expect // eslint-disable-line
const should = chai.should() // eslint-disable-line

const SubjectClass = require('./constraint')
const Triplet = require('./triplet')

describe('types/constraint', () => {
  it('Should be an object', () => {
    const subject = new SubjectClass('Foo_$eq_$Bar|Baz,Buzz_$in_$Bizz')
    assert.isObject(subject)
  })

  let alpha = 'Foo_$eq_$Bar|Baz,Buzz_$in_$Bizz'
  it(`Should be able to handle "${alpha}"`, () => {
    const subject = new SubjectClass(alpha)
    expect(subject, 'notation property should exist').to.have.property('notation')
    expect(subject.notation).to.equal(alpha)
    expect(subject, 'triplets property should exist').to.have.property('triplets')
    expect(subject.triplets)
      .to.be.a('array')
      .to.have.lengthOf(2)
    expect(subject.triplets[0]).to.be.an.instanceof(Triplet)
  })

  it('Should be able to return an array of Triplet', () => {
    const subject = SubjectClass.fromString('Foo_$eq_$Bar')
    expect(subject.triplets[0]).to.be.an.instanceof(Triplet)
    expect(subject.triplets)
      .to.be.a('array')
      .to.have.lengthOf(1)
    expect(subject.triplets[0].operands).to.include('Bar')
  })

  let bravo = 'Foo_$eq_$Bar,Hello_$eq_$Multiverse'
  it(`Should be able to handle "${bravo}" and stringify it back to the same thing`, () => {
    const subject = new SubjectClass(bravo)
    expect(subject.triplets[0].toString()).to.equal('Foo_$eq_$Bar')
    const stringified = subject.toString()
    expect(stringified).to.equal(bravo)
  })

  let expectedCharlie = 'Foo_$eq_$Bar|Baz'
  let charlie = 'Foo_$eq_$Bar|Baz,Bogus|things'
  it(`Should be able to give back "${expectedCharlie}" out of "${charlie}"`, () => {
    const subject = new SubjectClass(charlie)
    expect(subject.toString()).to.equal(expectedCharlie)
  })

  it('Should be able to accept more than one operands with pipe character and numbers', () => {
    const notation = 'SomeFieldName_$in_$FOO_SOMETHING|FOO_SOMETHING_MANUAL'
    const subject = new SubjectClass(notation)
    const firstTriplet = subject.triplets[0]
    expect(firstTriplet.field).to.equal('SomeFieldName')
    expect(firstTriplet.operands.length).to.equal(2)
    expect(firstTriplet.toString()).to.equal(notation)
    expect(subject.notation).to.equal(notation)
    expect(subject.toString()).to.equal(notation)
  })

  it('Should be able to replace only the matching member for the same field and operator', () => {
    const notation = 'SomeFieldName_$in_$FOO_SOMETHING|FOO_SOMETHING_MANUAL'
    const subject = new SubjectClass(notation)
    expect(subject.toString()).to.equal(notation)
    expect(subject.notation).to.equal(notation)
    subject.addTriplet('Status', 'eq', 'Successful')
    subject.addTriplet('SomeFieldName', 'in', 'Something_Different')
    // Also make sure #toString() is still in sync with #notation
    expect(subject.toString()).to.equal('SomeFieldName_$in_$Something_Different,Status_$eq_$Successful')
    expect(subject.notation).to.equal('SomeFieldName_$in_$Something_Different,Status_$eq_$Successful')
  })

  it('Should be able to handle a Date Range between two UNIX Epoch', () => {
    const subject = new SubjectClass()
    const fieldName = 'CreatedDate'
    const begin = 1529812800
    const end = 1530417600
    subject.setBetween(fieldName, begin, end)
    expect(subject.triplets[0].operands[0]).to.equal(begin.toString())
    expect(subject.triplets[1].operands[0]).to.equal(end.toString())
    let expected = 'CreatedDate_$gte_$'
    expected += begin
    expected += ',CreatedDate_$lte_$'
    expected += end
    expect(subject.toString()).to.equal(expected)
    expect(subject.notation).to.equal(expected)
    expect(subject.fields).to.include(fieldName)
    expect(subject.getFieldDefinition(fieldName).gte[0]).to.equal(begin)
  })

  it('Should be possible to update a Date Range', () => {
    const subject = new SubjectClass()
    const fieldName = 'CreatedDate'
    const begin = 1529812800
    const end = 1530417600
    subject.addTriplet('GroupMembership', 'in', 'admin|users|   ') // Potentially bogus, yet possible situation
    subject.setBetween(fieldName, begin, end)
    // console.log('\nConstraint before: ', subject.toString())
    expect(subject.getFieldDefinition(fieldName).lte[0]).to.equal(end)
    subject.addTriplet('Foo', 'eq', 'Baar') // Mix cards, too.
    const laterOn = end + 86400 // a day later
    subject.setBetween(fieldName, begin, laterOn)
    // console.log('\nConstraint after: ', subject.toString(), '\nend: ', end, '\nlaterOn: ', laterOn)
  })
})
