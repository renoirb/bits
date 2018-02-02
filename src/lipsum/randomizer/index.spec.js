/* eslint-env mocha */

import chai from 'chai' // eslint-disable-line

const assert = chai.assert   // eslint-disable-line
const expect = chai.expect   // eslint-disable-line
const should = chai.should() // eslint-disable-line

const component = require('.')

describe('randomizer/index', () => {
  it('Component should exist', () => {
    should.exist(component)
  })

  it('Should be an object', () => {
    assert.isObject(component)
  })

  it('Should only have Numbers and Sentences keys', () => {
    assert.property(component, 'Numbers')
    assert.property(component, 'Sentences')
  })

  it('Should be able to invoke Numbers', () => {
    const n = component.Numbers
    assert.isFunction(n)
    const sanityRun = Array.from(Array(5), n)
    expect(sanityRun, '0 should NOT be possible').that.does.not.include(0)
  })

  it('Should be able to invoke Sentences', () => {
    const text = `Hello world.\nFoo Bar Bazz.\nBuzz Bizz.\n`
    const s = new component.Sentences(text)
    assert.isObject(s)
    const sanityRun = s.getSentences(3)
    expect(sanityRun[0]).to.match(/^Hello world/)
  })
})