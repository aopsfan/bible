const { loadBook } = require('../server/server')
const R = require('ramda')

const withBook = ref => R.assoc('book', loadBook(ref.bookName))(ref)

const withFormat = (ref) => {
  const { bookName, startChapter, startVerse, endChapter, endVerse } = ref
  const sameChapter = startChapter === endChapter
  const format = sameChapter
    ? `${bookName} ${startChapter}:${startVerse}-${endVerse}`
    : `${bookName} ${startChapter}:${startVerse}-${endChapter}:${endVerse}`

  return R.assoc('format', format, ref)
}

module.exports = { withBook, withFormat }
