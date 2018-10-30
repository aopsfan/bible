const R = require('ramda')

const decorate = R.curry((key, fn, obj) => R.assoc(key, fn(obj), obj))
const concatAll = R.reduce(R.concat, [])
const attempt = R.curry((fn, obj) => obj && fn(obj))

const log = (obj) => {
  console.log(obj)
  return obj
}

module.exports = { decorate, concatAll, attempt, log }
