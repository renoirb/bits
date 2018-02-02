/* eslint-env mocha */

import chai from 'chai' // eslint-disable-line

const assert = chai.assert   // eslint-disable-line
const expect = chai.expect   // eslint-disable-line
const should = chai.should() // eslint-disable-line

const Sentences = require('./sentences')

describe('randomizer/sentences', () => {
  it('Sentences should exist', () => {
    const s = new Sentences()
    should.exist(s)
  })

  it('Sentences is an Object', () => {
    const s = new Sentences()
    assert.isObject(s)
  })

  it('Ensure we always receive arrays', () => {
    const s = new Sentences()
    const first = s.pickOne()
    assert.isArray(first, 'Sentences.pickOne() MUST return an array of 1 elements')
    expect(first[0]).to.match(/^Lorem ipsum dolor sit amet/, 'First time we invoke Sentences, we should get the first entry once')
  })

  it('Ensure we get Lorem ipsum dolor ... only the first time', () => {
    const s = new Sentences()
    const picks = s.getSentences(4)
    assert.isArray(picks, 'Sentences.getSentences(n) MUST return an array of n elements')
    expect(picks[0]).to.match(/^Lorem ipsum dolor sit amet/, 'First time we invoke Sentences, we should get the first entry once')
    expect(picks).to.have.lengthOf(4)
  })

  it('Should support using our own text', () => {
    const text = `Hello world.\nHow Dal eravate assunto scavata ore bianche.\nEx da scarabei poggiata profonda obbedito ed dominati ambascia.`
    const s = new Sentences(text)
    const picks = s.getSentences(3)
    expect(picks[0]).to.match(/^Hello world/)
  })
})
