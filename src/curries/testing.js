
class TestingOutcome {
  constructor (outcome, message = null) {
    this.outcome = outcome
    this.message = message
  }
  hasPassed () {
    return this.outcome
  }
  getMessage () {
    return this.message
  }
}

class Testing {
  constructor (subject) {
    this.subject = subject
    this.score = 0
  }

  runAssertionPass (inputValue, expected, message) {
    let assertionPass = inputValue => {
      const {failures} = this.loopValidators(inputValue)
      if (failures.length > 0 || inputValue.match(/\s/)) {
        return false
      }
      return true
    }

    const outcome = (assertionPass !== expected) ? false : assertionPass

    return new TestingOutcome(outcome, message)
  }
}

export default Testing
