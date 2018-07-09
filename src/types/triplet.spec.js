/* eslint-env mocha */

import chai from 'chai' // eslint-disable-line

const assert = chai.assert   // eslint-disable-line
const expect = chai.expect   // eslint-disable-line
const should = chai.should() // eslint-disable-line

const SubjectClass = require('./triplet')

describe('types/triplet', () => {
  it('Should be an object', () => {
    const i = new SubjectClass('Foo', 'eq', 'Bar|Baz')
    assert.isObject(i)
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

  it('Should only be considered if third component has a valid content', () => {
    expect(SubjectClass.parse('Foo_$eq_$Baar')).to.be.an.instanceof(SubjectClass)
    expect(SubjectClass.parse('Foo_$eq_$Baar|Buzz')).to.be.an.instanceof(SubjectClass)
    expect(SubjectClass.parse('Foo_$ne_$Baar|Buzz')).to.be.an.instanceof(SubjectClass)
    expect(SubjectClass.parse('Foo_$nin_$Bar')).to.be.an.instanceof(SubjectClass)
    expect(SubjectClass.parse('Foo_$BOGUSSSSS_$Bar')).to.equal(false)
    expect(SubjectClass.parse('Foo_$lte_$')).to.equal(false)
  })
})
