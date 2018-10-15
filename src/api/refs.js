const getRef = (bookName, references) => {
  const matcher = /(\d+):?(\d*)-?(\d*):?(\d*)$/ // ...just trust me. I'm sorry
  const result = matcher.exec(references)
  if (!result) return null

  const [_, ...numberStrings] = result
  const numbers = numberStrings.map(s => parseInt(s, 10))

  const isSingleVerse = numbers[0] && numbers[1] && !numbers[2] && !numbers[3]
  const isSingleChapter = numbers[0] && !numbers[1] && !numbers[2] && !numbers[3]
  const isChapterToChapter = numbers[0] && !numbers[1] && numbers[2] && !numbers[3]
  const isChapterVerseToVerse = numbers[0] && numbers[1] && numbers[2] && !numbers[3]
  const isChapterVerseToChapterVerse = numbers[0] && numbers[1] && numbers[2] && numbers[3]

  if (!isSingleVerse &&
    !isSingleChapter &&
    !isChapterToChapter &&
    !isChapterVerseToVerse &&
    !isChapterVerseToChapterVerse) {
    return null
  }

  const [startChapter, startVerse] = numbers
  const endChapter = (isSingleVerse || isSingleChapter || isChapterVerseToVerse)
    ? startChapter
    : numbers[2]

  let endVerse
  if (isSingleVerse) endVerse = startVerse
  if (isSingleChapter || isChapterToChapter) endVerse = null
  if (isChapterVerseToVerse) endVerse = numbers[2]
  if (isChapterVerseToChapterVerse) endVerse = numbers[3]

  return {
    bookName,
    startChapter,
    startVerse,
    endChapter,
    endVerse,
  }
}

module.exports = { getRef }
