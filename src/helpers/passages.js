const R = require('ramda')
const F = require('../helpers/functions')
const { loadBook } = require('../server/server')

//
// Helpers
//

const chapterLens = chapter => R.lensPath(['content', chapter - 1])
const verseLens = R.curry((chapter, verse) => R.lensPath(['content', chapter - 1, verse - 1]))
const chapterLength = R.curry((book, chapter) => R.view(chapterLens(chapter), book).length)

const getVerse = R.curry((book, chapter, verse) => ({
  book: book.book,
  chapter,
  verse,
  content: R.view(verseLens(chapter, verse), book),
}))

const getChapterVerses = R.curry((book, chapter, options) => R.map(
  getVerse(book, chapter),
  R.range(
    options.startVerse || 1,
    (options.endVerse || chapterLength(book, chapter)) + 1,
  ),
))

const getWholeChapter = getChapterVerses(R.__, R.__, {})

const verseFormat = (verse) => {
  const { chapter, verse: v, content } = verse
  return `${v === 1 ? '\n\n' : ''}[${chapter}:${v}] ${content}`
}

//
// Exports
//

const make = F.attempt((ref) => {
  const { bookName, startChapter, startVerse, endChapter, endVerse } = ref
  const book = loadBook(bookName)

  const validStartVerse = !startVerse || chapterLength(book, startChapter) >= startVerse
  const validEndVerse = !endVerse || chapterLength(book, (endChapter || startChapter)) >= endVerse
  if (!validStartVerse || !validEndVerse) {
    console.log(validStartVerse)
    return null
  }

  if (!endChapter || startChapter === endChapter) {
    const content = getChapterVerses(book, startChapter, { startVerse, endVerse })
    return { ref, content }
  }

  const startRefVerses = getChapterVerses(book, startChapter, { startVerse })
  const middleVerses = R.flatten(R.map(
    getWholeChapter(book),
    R.range(startChapter + 1, endChapter),
  ))
  const endRefVerses = getChapterVerses(book, endChapter, { endVerse })
  const content = F.concatAll([startRefVerses, middleVerses, endRefVerses])

  return { ref, content }
})

const addFormat = F.attempt(F.decorate(
  'format',
  R.pipe(
    R.prop('content'),
    R.map(verseFormat),
    R.join(' '),
  ),
))

module.exports = { make, addFormat }
