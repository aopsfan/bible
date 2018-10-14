const lookup = require('./server')
const R = require('ramda')

//
// Functions
//

const parseLine = (line) => {
  const matcher = /(\d?\D+)(\d+):?(\d*)-?(\d*):?(\d*)$/ // ...just trust me. I'm sorry
  const formattedLine = line.toLowerCase().replace(/\s/g, '') // no caps or whitespace
  const result = matcher.exec(formattedLine)

  if (!result) return null

  const [_, bookName, ...numberStrings] = result
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

  return { bookName, startChapter, startVerse, endChapter, endVerse }
}

const formatPassage = serverData => serverData
  .map(({ chapter, verse, content }) => `${verse === 1 ? '\n\n' : ''}[${chapter}:${verse}] ${content}`)
  .join(' ')

//
// CLI Setup
//

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '+> ',
})

readline.prompt()

readline.on('line', (line) => {
  const lineData = parseLine(line)

  if (lineData) {
    const { bookName, startChapter, startVerse, endChapter, endVerse } = lineData
    const serverData = lookup(bookName, startChapter, startVerse, endChapter, endVerse)
    const formattedData = formatPassage(serverData)

    console.log(formattedData)
    console.log('\n')
  } else {
    console.log(`Sorry, didn't get that`)
  }

  readline.prompt()
}).on('close', () => console.log('\nGoodbye'))
