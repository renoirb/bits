class DateEpoch {
  constructor (epoch = {}) {
    const typeCheckFinite = e => isFinite(e)
    const typeCheckDate = e => 'getUTCDate' in e
    switch (true) {
      case typeCheckFinite(epoch):
        this.epoch = toMilliseconds(parseInt(epoch))
        break
      case typeCheckDate(epoch):
        this.epoch = epoch.getTime()
        break
      default:
        const ms = getTimeNowUtcMillliseconds()
        this.epoch = ms
        break
    }
  }

  toJSON () {
    return {
      epoch: this.epoch
    }
  }

  toString () {
    return this.epoch
  }

  toDate () {
    return getDateFromEpoch(this.epoch)
  }
}

export const getDateFromEpoch = epoch => {
  let ensureMillisecondsInt = toMilliseconds(epoch)
  return new Date(ensureMillisecondsInt)
}

/**
 * Ensure we get milliseconds out of some UNIX Epoch.
 *
 * If an UNIX Epoch is already in milliseconds return the same value;
 * If an UNIX Epoch is close enough, and within hoursTreshold limit, multiply by 1000.
 */
export const toMilliseconds = (maybeMilliseconds = 0, hoursTreshold = 25) => {
  let out = parseInt(maybeMilliseconds)
  const ms = new Date().getTime()
  // const millisecondsDigitCount = ((ms).toString()).length
  const seconds = Math.floor(ms / 1000)
  const secondsDigitCount = seconds.toString().length
  const isExpressedInSeconds = maybeMilliseconds.toString().length === secondsDigitCount
  // const isExpressedInMilliSeconds = ((maybeMilliseconds).toString()).length === millisecondsDigitCount
  // If the maybeMilliseconds is hoursTreshold hours (e.g. 25) or less, adjust the time to miliseconds
  // Otherwise let's not touch it
  if (isExpressedInSeconds) {
    const durationInSeconds = Math.floor(maybeMilliseconds - seconds)
    const hours = Math.floor(durationInSeconds / 3600)
    if (hours < hoursTreshold) {
      out *= 1000
    }
  }

  return out
}

export const getDaysAgoToMilliseconds = days => days * 1000 * 86400
export const getMillisecondsToDaysAgo = ms => ms / 86400 / 1000

export const getDaysAgoFromDefinition = (dfn = {}, defaultDays = 0) => {
  const fields = Object.keys(dfn)
  const hasLteOperator = fields.includes('lte')
  const hasGteOperator = fields.includes('gte')

  if (hasGteOperator && hasLteOperator) {
    return (dfn.lte[0] - dfn.gte[0]) / 86400000
  } else {
    return defaultDays
  }
}

export const getTimeNowUtcMillliseconds = () => new Date().getTime() // Always UTC!

export const getTimeDaysAgoMilliseconds = (endTimeMilliseconds, days = 1) => {
  const begin = getDaysAgoToMilliseconds(days)
  return endTimeMilliseconds - begin
}

export const getDaysAgoMillisecondsAsTuple = days => {
  const endTime = getTimeNowUtcMillliseconds()
  const startTime = getTimeDaysAgoMilliseconds(endTime, days)

  return [startTime, endTime]
}

export const getDeltaDaysAgoFromNowUtcMilliseconds = days => {
  const [startTime, endTime] = getDaysAgoMillisecondsAsTuple(days)
  return endTime - startTime
}

export default DateEpoch
