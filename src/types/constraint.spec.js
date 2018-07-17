/* eslint-env mocha */

import chai from 'chai' // eslint-disable-line

const assert = chai.assert // eslint-disable-line
const expect = chai.expect // eslint-disable-line
const should = chai.should() // eslint-disable-line

const SubjectClass = require('./constraint')
const Triplet = require('./triplet')

describe('types/constraint', () => {
  it('Should be an object', () => {
    const i = new SubjectClass('Foo_$eq_$Bar|Baz,Buzz_$in_$Bizz')
    assert.isObject(i)
  })

  let alpha = 'Foo_$eq_$Bar|Baz,Buzz_$in_$Bizz'
  it(`Should be able to handle "${alpha}"`, () => {
    const i = new SubjectClass(alpha)
    expect(i, 'notation property should exist').to.have.property('notation')
    expect(i.notation).to.equal(alpha)
    expect(i, 'triplets property should exist').to.have.property('triplets')
    expect(i.triplets)
      .to.be.a('array')
      .to.have.lengthOf(2)
    expect(i.triplets[0]).to.be.an.instanceof(Triplet)
  })

  it('Should be able to return an array of Triplet', () => {
    const i = SubjectClass.fromString('Foo_$eq_$Bar')
    expect(i.triplets[0]).to.be.an.instanceof(Triplet)
    expect(i.triplets)
      .to.be.a('array')
      .to.have.lengthOf(1)
    expect(i.triplets[0].operands).to.include('Bar')
  })

  let bravo = 'Foo_$eq_$Bar,Hello_$eq_$Multiverse'
  it(`Should be able to handle "${bravo}" and stringify it back to the same thing`, () => {
    const i = new SubjectClass(bravo)
    expect(i.triplets[0].toString()).to.equal('Foo_$eq_$Bar')
    const stringified = i.toString()
    expect(stringified).to.equal(bravo)
  })

  let expectedCharlie = 'Foo_$eq_$Bar|Baz'
  let charlie = 'Foo_$eq_$Bar|Baz,Bogus|things'
  it(`Should be able to give back "${expectedCharlie}" out of "${charlie}"`, () => {
    const i = new SubjectClass(charlie)
    expect(i.toString()).to.equal(expectedCharlie)
  })
})
