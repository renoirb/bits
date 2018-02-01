/* eslint-env mocha */

const mocha = require('mocha')
const { expect } = require('chai')
const number = require('./number')

describe('lipsum/number', () => {
  it('Return a number', () => {
      return Number.isNaN(number(1)) === false
  })
})
