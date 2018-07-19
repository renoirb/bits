/* eslint-env jest */
/* global describe,beforeAll,afterAll,beforeEach,afterEach,test,expect */

require('jest') // '@bit/bit.testers.jest'

const component = require('./number') // randomNumber

describe('number', () => {
  test('Component should exist', () => {
    expect(component).toBeDefined()
  })

  test('Should return a number', () => {
    expect(component(1)).toBeLessThan(9)
  })

  test('Even after 20 attempts of getting a 1 digit long number, 0 did not occur', () => {
    // This might look obscure, but we are invoking component(1) 20 times here.
    // That is because component first argument is 1 by default.
    const twentyAttempts = Array.from(Array(20), component)
    expect(twentyAttempts).not.toContain(0)
  })

  test('Even after 20 attempts of getting a 1 digit long number, 0 did not occur', () => {
    // Notice this time we're returning a function call number(3), and not leveraging
    // number's first default argument as 1.
    const twentyAttempts = Array.from(Array(20), () => component(3))
    expect(twentyAttempts).not.toContain(0)
    const twentyAttemptsFirstDigit = Array.from(Array(20), () => component(3).toString()[0])
    expect(twentyAttemptsFirstDigit).not.toContain(0)
  })

  test('Should give a number of the given length', () => {
    // Number scalar type does not have a length property
    // this is why we convert the returned Number into a String
    expect(String(component(3))).toHaveLength(3)
  })
})
