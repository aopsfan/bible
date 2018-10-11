const requestPassage = require('./server')

const data = requestPassage(
  'John',
  { chapter: 3, verse: 16 },
  { chapter: 3, verse: 20 },
)

const formattedData = data
  .map(({ chapterRef, verseRef, content }) => `[${chapterRef}:${verseRef}] ${content}`)
  .join(' ')

console.log(formattedData)
