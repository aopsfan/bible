const R = require('ramda')
const F = require('./functions')

const make = (args) => {
  const input = args[0] // expect only one argument here
  const [bookName, references] = input.split('.')
  const matcher = /(\d+):?(\d*)-?(\d*):?(\d*)$/ // ...just trust me. I'm sorry
  const result = matcher.exec(references)
  if (!result) return null

  const numberStrings = result.slice(1)
  const numbers = numberStrings.map(s => parseInt(s, 10))

  const isSingleVerse = numbers[0] && numbers[1] && !numbers[2] && !numbers[3]
  const isSingleChapter = numbers[0] && !numbers[1] && !numbers[2] && !numbers[3]
  const isChapterToChapter = numbers[0] && !numbers[1] && numbers[2] && !numbers[3]
  const isChapterVerseToVerse = numbers[0] && numbers[1] && numbers[2] && !numbers[3]
  const isChapterVerseToChapterVerse = numbers[0] && numbers[1] && numbers[2] && numbers[3]

  if (!isSingleVerse
    && !isSingleChapter
    && !isChapterToChapter
    && !isChapterVerseToVerse
    && !isChapterVerseToChapterVerse) {
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

  return { bookName, startChapter, startVerse, endChapter, endVerse }
}

const addFormat = F.attempt((ref) => {
  const { bookName, startChapter, startVerse, endChapter, endVerse } = ref
  const sameChapter = startChapter === endChapter
  const format = sameChapter
    ? `${bookName} ${startChapter}:${startVerse}-${endVerse}`
    : `${bookName} ${startChapter}:${startVerse}-${endChapter}:${endVerse}`

  return R.assoc('format', format, ref)
})

module.exports = { make, addFormat }
