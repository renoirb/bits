/* eslint-env mocha */

import chai from 'chai' // eslint-disable-line

const assert = chai.assert   // eslint-disable-line
const expect = chai.expect   // eslint-disable-line
const should = chai.should() // eslint-disable-line

const SubjectClass = require('./constraint')
const Triplet = require('./triplet')

describe('types/constraint', () => {
  it('Should be an object', () => {
    const i = new SubjectClass('Foo_$eq_$Bar|Baz,Buzz_$in_$Bizz')
    assert.isObject(i)
  })

  it('Should be able to handle Foo_$eq_$Bar|Baz,Buzz_$in_$Bizz', () => {
    const i = new SubjectClass('Foo_$eq_$Bar|Baz,Buzz_$in_$Bizz')
    expect(i, 'notation property should exist').to.have.property('notation')
    expect(i.notation).to.equal('Foo_$eq_$Bar|Baz,Buzz_$in_$Bizz')
    expect(i, 'constraints property should exist').to.have.property('constraints')
    expect(i.constraints).to.be.a('array').to.have.lengthOf(2)
    expect(i.constraints[0]).to.be.an.instanceof(Triplet)
  })

  it('Should be able to return an array of Triplet', () => {
    const i = SubjectClass.parse('Foo_$eq_$Bar')
    expect(i[0]).to.be.an.instanceof(Triplet)
  })

  it('Should be able to handle stringify back to Foo_$eq_$Bar,Hello_$eq_$Multiverse', () => {
    const i = new SubjectClass('Foo_$eq_$Bar,Hello_$eq_$Multiverse')
    expect(i.constraints[0].toString()).to.equal('Foo_$eq_$Bar')
    const stringified = i.toString()
    expect(stringified).to.equal('Foo_$eq_$Bar,Hello_$eq_$Multiverse')
  })

  it('Should be able to take only Foo_$eq_$Bar|Baz out from Foo_$eq_$Bar|Baz,Bogus|things', () => {
    const i = new SubjectClass('Foo_$eq_$Bar|Baz,Bogus|things')
    const stringified = i.toString()
    expect(stringified).to.equal('Foo_$eq_$Bar|Baz')
  })
})
