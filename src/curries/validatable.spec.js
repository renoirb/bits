/* eslint-env mocha */

import chai from 'chai' // eslint-disable-line

const assert = chai.assert   // eslint-disable-line
const expect = chai.expect   // eslint-disable-line
const should = chai.should() // eslint-disable-line

const {validatable} = require('./validatable')

class UsernameValidator {
  constructor () {
    validatable(this)
    this.validatable.addRule('size', true, /^[0-9a-zA-z\-_]{8,19}$/)
    this.validatable.addRule('billable_format', false, /^[ABGKNPQSTWXZ]{1}[0-9]{8}$/)
  }
}

describe('curries/validatable', () => {
  it('Component should exist', () => {
    should.exist(validatable)
  })

  it('Is a Function', () => {
    assert.isFunction(validatable)
  })

  it('Subject that has been curried has validatable object', () => {
    const subject = new UsernameValidator()
    assert.isObject(subject.validatable, 'Has a ValidatableRules object')
    assert.isFunction(subject.validate, 'Has added a "validate" function')
  })

  it('Can run validation rules on', () => {
    const subject = new UsernameValidator()
    const runs = []
    runs.push(['J55555555', true, 'Billable account format lookalike, but not using expected first caracter'])
    runs.push(['jjjjjj', false, 'Less than 9'])
    runs.push(['jjjjjjjjj', true, 'Only letters'])
    runs.push(['jjj2jjjjj', true, 'Letters and 1 number'])
    runs.push(['jJJJ4__jii', true, 'Upper, lower and allowed special'])
    runs.push(['jJJJ4<jii', false, 'Upper, lower and non allowed special'])
    runs.push(['jjjJJ J4jj', false, 'Upper, lower, special and a space'])
    runs.push(['W55555555', false, 'Billable account format'])
    runs.push(['J55555555', true, 'Billable account format lookalike, but not using expected first caracter'])
    for (const run of runs) {
      const check = subject.validate(run[0])
      assert(check.hasPassed() === run[1], `String ${run[0]} should be ${run[1].toString()}, because; ${run[2]}`)
    }
  })
})
