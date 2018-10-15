const R = require('ramda')

const verseContentWithBracketedReference = ({ chapter, verse, content }) =>
  `${verse === 1 ? '\n\n' : ''}[${chapter}:${verse}] ${content}`

const withFormat = verse => R.assoc(
  'format',
  verseContentWithBracketedReference(verse),
  verse,
)

module.exports = { withFormat }
