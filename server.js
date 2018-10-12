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

  if (startRef.chapter === endRef.chapter) { // Genesis 1:1 - 1:10
    const chapter = getChapter(book, startRef.chapter)
    verses = range(startRef.verse, endRef.verse)
      .map(getVerse(chapter))
  } else {
    // Example: Genesis 1:1 - 2:10
    const startChapter = getChapter(book, startRef.chapter)
    const startChapterVerses = range(startRef.verse, startChapter.content.length)
      .map(getVerse(startChapter))
    const endChapter = getChapter(book, endRef.chapter)
    const endChapterVerses = range(1, endRef.verse)
      .map(getVerse(endChapter))

    if (endRef.chapter - startRef.chapter > 1) {
      // Example: Genesis 1:10 - 4:10
      // This is tricky: We need a portion of chapter 1, a portion of chapter
      // 4 (see the above code), but we also need all of chapter 2 and chapter
      // 3.
      const inBetweenRange = range(startRef.chapter + 1, endRef.chapter - 1)
      const inBetweeners = inBetweenRange.reduce((verses, chapterRef) => {
        const chapter = getChapter(book, chapterRef)
        return [
          ...verses,
          ...range(1, chapter.content.length).map(getVerse(chapter)),
        ]
      }, [])

      verses = [
        ...startChapterVerses,
        ...inBetweeners,
        ...endChapterVerses,
      ]
    } else {
      verses = [
        ...startChapterVerses,
        ...endChapterVerses,
      ]
    }
  }

  return verses
}

module.exports = getPassage
