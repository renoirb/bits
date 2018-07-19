/**
 * @bit
 * @public
 * @name validatable
 * @package curries
 * @param {object} subject — An object we want to add validation system to
 * @description Curries an object/function with a "validatable" property containing ValidatableRules
 * and a "validate" function.
 *
 * CAUTION: This has been written back in 2013 and dearly needs refactoring.
 *
 * @example
 * import {validatable} from './validatable'
 *
 * // Notice this MUST either be a class, an object, or a Function, it cannot be an arrow function.
 * class UsernameValidator {
 *   constructor () {
 *     validatable(this)
 *     this.validatable.addRule('size', true, /^[0-9a-zA-z\-_]{8,19}$/)
 *     this.validatable.addRule('billable_format', false, /^[ABGKNPQSTWXZ]{1}[0-9]{8}$/)
 *   }
 * }
 *
 * // ... later in the code
 *
 * const validator = new UsernameValidator();
 *
 * // With rules above, "jjjjjj" should fail because it has less than 9 characters
 * const check1 = validator.validate('jjjjjj')
 * check.hasPassed() // => false
 */
const validatable = (subject) => {
  subject.validatable = new ValidatableRules()
  subject.validate = function (inputValue) {
    const rules = this.validatable.getRules()
    const outcome = new ValidatableOutcome()
    for (const rule of rules) {
      outcome.addCheck(rule.check(inputValue))
    }

    return outcome
  }.bind(subject)
}

/**
 * @bit
 * @public
 * @name ValidatableRules
 * @package curries
 * @description Add and Get validation rules
 *
 * @example
 * import {validatable} from './validatable'
 *
 * class UsernameValidator {
 *   constructor () {
 *     validatable(this)
 *     this.validatable.addRule('size', true, /^[0-9a-zA-z\-_]{8,19}$/)
 *     this.validatable.addRule('billable_format', false, /^[ABGKNPQSTWXZ]{1}[0-9]{8}$/)
 *   }
 * }
 *
 * // ... later in the code
 *
 * const validator = new UsernameValidator();
 * validator.validatable // => ValidatableRules
 */
class ValidatableRules {
  constructor () {
    this.rules = []
  }
  addRule (key, expectation, pattern) {
    this.rules.push(new Rule(key, expectation, pattern))
  }
  getRules () {
    return this.rules
  }
}

/**
 * @bit
 * @public
 * @name Rule
 * @package curries
 * @description A validation Rule, automatically added via ValidatableRules
 */
class Rule {
  constructor (key, expectation, pattern) {
    this.expectation = expectation
    this.key = key
    this.pattern = pattern
  }
  check (value) {
    const outcome = this.pattern.test(value)
    return {outcome, value, key: this.key, expectation: this.expectation}
  }
}

/**
 * @bit
 * @public
 * @name ValidatableOutcome
 * @package curries
 * @description Outcome of "validate" function we curried
 *
 * @example
 * import {validatable, ValidatableOutcome} from './validatable'
 *
 * class UsernameValidator {
 *   constructor () {
 *     validatable(this)
 *     this.validatable.addRule('size', true, /^[0-9a-zA-z\-_]{8,19}$/)
 *     this.validatable.addRule('billable_format', false, /^[ABGKNPQSTWXZ]{1}[0-9]{8}$/)
 *   }
 *   validate (inputValue) {
 *     // NOTICE: This is how it is done via validatable curries
 *     // Replace "validate" function, if you need to have other checks than
 *     // only using RegExes
 *     const rules = this.validatable.getRules()
 *     const outcome = new ValidatableOutcome()
 *     for (const rule of rules) {
 *       outcome.addCheck(rule.check(inputValue))
 *     }
 *     return outcome
 *   }
 * }
 */
class ValidatableOutcome {
  constructor () {
    this.passes = []
    this.failures = []
  }
  hasPassed () {
    return this.failures.length < 1 && this.passes.length > 0
  }
  getFailures () {
    return this.failures
  }
  addCheck (check) {
    if (check.outcome === check.expectation) {
      this.passes.push(check)
    } else {
      this.failures.push(check)
    }
  }
}

export default {validatable, ValidatableOutcome, ValidatableRules, Rule}
