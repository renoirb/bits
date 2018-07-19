/* eslint-env jest */
/* global describe,beforeAll,afterAll,beforeEach,afterEach,test,expect */

require('jest') // '@bit/bit.testers.jest'

const {validatable, ValidatableRules} = require('./validatable')

class UsernameValidator {
  constructor () {
    validatable(this)
    this.validatable.addRule('size', true, /^[0-9a-zA-z\-_]{8,19}$/)
    this.validatable.addRule('billable_format', false, /^[ABGKNPQSTWXZ]{1}[0-9]{8}$/)
  }
}

describe('curries/validatable', () => {
  test('Component should exist', () => {
    expect(validatable).toBeDefined()
  })

  test('Subject that has been curried has validatable object', () => {
    const subject = new UsernameValidator()
    expect(subject).toHaveProperty('validatable') // Has a ValidatableRules object
    expect(subject.validatable).toBeInstanceOf(ValidatableRules)
    expect(subject).toHaveProperty('validate') // Has added a "validate" function
  })

  test('Can run validation rules on', () => {
    const subject = new UsernameValidator()
    const runs = []
    // Refactored from Mocha to Jest, messages aren't taken into account anymore, but tests are still valid.
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
      // assert(check.hasPassed() === run[1], `String ${run[0]} should be ${run[1].toString()}, because; ${run[2]}`)
      expect(check.hasPassed()).toBe(run[1])
    }
  })
})
