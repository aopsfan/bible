const fs = require('fs')

//
// Helpers
//

const range = (start, stop) => Array.from({ length: stop - start + 1 }, (_, i) => start + i)

//
// Functions
//

const getBook = (bookName) => {
  const path = `kjv-new/${bookName.toLowerCase()}.json`
  const data = fs.readFileSync(path)
  return JSON.parse(data)
}

const getChapter = (book, chapterRef) => ({
  book: book.book,
  chapterRef,
  content: book.content[chapterRef - 1],
})

const getVerse = chapter => verseRef => ({
  book: chapter.book,
  chapterRef: chapter.chapterRef,
  verseRef,
  content: chapter.content && chapter.content[verseRef - 1],
})

//
// Exports
//

const getPassage = (bookName, startRef, endRef) => {
  const book = getBook(bookName)
  let verses

  if (startRef.chapter === endRef.chapter) {
    const chapter = getChapter(book, startRef.chapter)
    verses = range(startRef.verse, endRef.verse)
      .map(getVerse(chapter))
  } else {
    const startChapter = getChapter(book, startRef.chapter)
    const startChapterVerses = range(startRef.verse, startChapter.content.length)
      .map(getVerse(startChapter))
    const endChapter = getChapter(book, endRef.chapter)
    const endChapterVerses = range(1, endRef.verse)
      .map(getVerse(endChapter))

    verses = [...startChapterVerses, ...endChapterVerses]
  }

  return verses
}

module.exports = getPassage
