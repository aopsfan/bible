const R = require('ramda')
const { getRef } = require('../api/refs')
const { getPassage } = require('../api/passages')
const refDecorators = require('../decorators/refDecorators')
const passageDecorators = require('../decorators/passageDecorators')
const { addCrossReference } = require('../server/server')

const formatPassage = passage => R.map(R.pipe(
  passageDecorators.withFormat,
  R.prop('format'),
), passage).join(' ')

const formatCref = (ref1, ref2) => {
  const getFormat = R.pipe(
    refDecorators.withFormat,
    R.prop('format'),
  )
  return `Cross-reference: ${getFormat(ref1)} <> ${getFormat(ref2)}`
}

const parse = (line) => {
  const [firstPart, ...otherParts] = line.toLowerCase().split(/ /)
  const isPassageReference = firstPart[0] !== '\\'

  if (isPassageReference) {
    const ref = getRef(firstPart, otherParts[0])
    const passage = ref && getPassage(ref)
    return passage && formatPassage(passage)
  }

  const command = firstPart.slice(1)

  if (command === 'cref') {
    console.log('cref')
    const ref1 = getRef(otherParts[0], otherParts[1])
    const ref2 = getRef(otherParts[2], otherParts[3])

    addCrossReference(ref1, ref2)

    return formatCref(ref1, ref2)
  }
}

module.exports = { parse }
