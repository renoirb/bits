/* eslint-env mocha */

import chai from 'chai' // eslint-disable-line

const assert = chai.assert   // eslint-disable-line
const expect = chai.expect   // eslint-disable-line
const should = chai.should() // eslint-disable-line

const component = require('./number')

describe('randomizer/number', () => {
  it('Component should exist', () => {
    should.exist(component)
  })

  it('Is a Function', () => {
    assert.isFunction(component)
  })

  it('Should return a number', () => {
    assert.isNumber(component(1))
  })

  it('Even after 20 attempts of getting a 1 digit long number, 0 did not occur', () => {
    // This might look obscure, but we are invoking component(1) 20 times here.
    // That is because component first argument is 1 by default.
    const twentyAttempts = Array.from(Array(20), component)
    expect(twentyAttempts, '0 should NOT be possible').that.does.not.include(0)
  })

  it('Even after 20 attempts of getting a 1 digit long number, 0 did not occur', () => {
    // Notice this time we're returning a function call number(3), and not leveraging
    // number's first default argument as 1.
    const twentyAttempts = Array.from(Array(20), () => component(3))
    expect(twentyAttempts).that.does.not.include(0)
    const twentyAttemptsFirstDigit = Array.from(Array(20), () => component(3).toString()[0])
    expect(twentyAttemptsFirstDigit, '0 should NOT be the first digit').that.does.not.include(0)
  })

  it('Should give a number of the given length', () => {
    // Number scalar type does not have a length property
    // this is why we convert the returned Number into a String
    expect(String(component(3))).to.have.lengthOf(3)
  })
})
