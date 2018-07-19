/* eslint-env jest */
/* global describe,beforeAll,afterAll,beforeEach,afterEach,test,expect */

require('jest') // '@bit/bit.testers.jest'

const component = require('.')

test('Component should exist', () => {
  expect(component).toBeDefined()
})

// test('Should only have randomNumber and Sentences keys', () => {
//   assert.property(component, 'randomNumber')
//   assert.property(component, 'Sentences')
// })

test('Should be able to invoke Numbers', () => {
  const randomNumber = component.randomNumber
  // assert.isFunction(n)
  const sanityRun = Array.from(Array(5), randomNumber)
  expect(sanityRun).not.toContain(0)
})

test('Should be able to invoke Sentences', () => {
  const text = `Hello world.\nFoo Bar Bazz.\nBuzz Bizz.\n`
  const subject = new component.Sentences(text)
  const sanityRun = subject.getSentences(3)
  expect(sanityRun[0]).toMatch(/^Hello world/)
})

test('Should be invokable and used as an alias', () => {
  const randomNumber = component.randomNumber
  expect(String(randomNumber(3))).toHaveLength(3)
  expect(String(randomNumber(2))).toHaveLength(2)
  const sanityRun = Array.from(Array(20), () => randomNumber(1))
  expect(sanityRun).not.toContain(0)
})
