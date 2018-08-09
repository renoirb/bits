/* eslint-env jest */
/* global describe,beforeAll,afterAll,beforeEach,afterEach,test,expect */

require('jest') // '@bit/bit.testers.jest'

const SubjectClass = require('./date-epoch').default
const { getDateFromEpoch, toMilliseconds } = require('./date-epoch')

describe('DateEpoch', () => {
  const inputEpochInt = 1533762055251
  const expectEpochIntToISOString = '2018-08-08T21:00:55.251Z'
  test('constructor', () => {
    const subject = new SubjectClass(inputEpochInt)
    expect(JSON.stringify(subject)).toBe(JSON.stringify({ epoch: inputEpochInt }))
    expect(JSON.parse(JSON.stringify(subject))).toMatchObject({ epoch: inputEpochInt })
    expect(String(subject)).toEqual(inputEpochInt.toString())
    expect(subject.toDate().toISOString()).toEqual(expectEpochIntToISOString)
    expect(JSON.stringify(subject)).toMatchSnapshot()
  })
})

describe('getDateFromEpoch', () => {
  const subjectClosure = getDateFromEpoch
  const inputEpochInt = 1533762055251
  const inputEpochIntString = String(inputEpochInt)
  const expectEpochIntToISOString = '2018-08-08T21:00:55.251Z'
  test('Coerce input from String to Integer', () => {
    const subject = subjectClosure(inputEpochIntString)
    expect(subject.toISOString()).toEqual(expectEpochIntToISOString)
  })
})

describe('toMilliseconds', () => {
  const subjectClosure = toMilliseconds
  const inputEpochSecondsInt = 1533762055
  test('Multiply an Integer that looks like Seconds to Milliseconds', () => {
    // In other words, if it only miss three digits, do something.
    const subject = subjectClosure(inputEpochSecondsInt)
    expect(subject).toEqual(inputEpochSecondsInt * 1000)
  })
  test('Do NOT touch the input Integer if the count of digits has less or more than expected', () => {
    const oneMissing = 153376205
    expect(subjectClosure(oneMissing)).toBe(oneMissing)
    const oneTooMuch = parseInt(oneMissing + '511')
    expect(subjectClosure(oneTooMuch)).toBe(oneTooMuch)
  })
})
