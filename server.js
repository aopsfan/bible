const fs = require('fs')
const R = require('ramda')

//
// Helpers
//

const chapterLens = chapter => R.lensPath(['content', chapter - 1])
const verseLens = R.curry((chapter, verse) => R.lensPath(['content', chapter - 1, verse - 1]))

//
// Functions
//

const loadBook = (bookName) => {
  const path = `kjv-new/${bookName.toLowerCase()}.json`
  const data = fs.readFileSync(path)
  return JSON.parse(data)
}

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

//
// Exports
//

const lookup = (bookName, startChapter, startVerse, endChapter, endVerse) => {
  const book = loadBook(bookName)

  if (startChapter === endChapter) {
    return getChapterVerses(
      book,
      startChapter,
      { startVerse: startVerse, endVerse: endVerse },
    )
  }

  const startRefVerses = getChapterVerses(
    book,
    startChapter,
    { startVerse: startVerse },
  )

  const middleVerses = R.flatten(R.map(
    getWholeChapter(book),
    R.range(startChapter + 1, endChapter),
  ))

  const endRefVerses = getChapterVerses(
    book,
    endChapter,
    { endVerse: endVerse },
  )

  return [
    ...startRefVerses,
    ...middleVerses,
    ...endRefVerses,
  ]
}

module.exports = lookup
