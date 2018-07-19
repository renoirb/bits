/* eslint-env jest */
/* global describe,beforeAll,afterAll,beforeEach,afterEach,test,expect */

require('jest') // '@bit/bit.testers.jest'

const SubjectClass = require('./sentences')

test('Sentences should exist', () => {
  const subject = new SubjectClass()
  expect(subject).toBeDefined()
  expect(subject).toHaveProperty('sentences')
  expect(subject).toHaveProperty('possibilities')
  expect(subject).toHaveProperty('isFirstTime', true)
})

test('Sentences is an Object', () => {
  const subject = new SubjectClass()
  expect(subject).toBeInstanceOf(SubjectClass)
})

test('Ensure we always receive arrays', () => {
  const subject = new SubjectClass()
  const first = subject.pickOne()
  expect(first).toBeInstanceOf(Array)
  expect(first).toHaveLength(1)
  expect(first[0]).toMatch(/^Lorem ipsum dolor sit amet/)
})

test('Ensure we get Lorem ipsum dolor ... only the first time', () => {
  const subject = new SubjectClass()
  const picks = subject.getSentences(4)
  expect(picks).toMatchSnapshot()
  expect(picks[0]).toMatch(/^Lorem ipsum dolor sit amet/)
  expect(picks).toHaveLength(4)
})

test('Should support using our own text', () => {
  const text = `Hello world.\nHow Dal eravate assunto scavata ore bianche.\nEx da scarabei poggiata profonda obbedito ed dominati ambascia.`
  const subject = new SubjectClass(text)
  const picks = subject.getSentences(3)
  expect(picks[0]).toMatch(/^Hello world/)
})
