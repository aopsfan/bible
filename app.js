const getPassage = require('./server')

//
// Functions
//

const parseLine = (line) => {
  const matcher = /(\d*\D+)(\d+:\d+)-?(\d*:?\d*$)/ // ...just trust me. I'm sorry
  const formattedLine = line.toLowerCase().replace(/\s/g, '') // no caps or whitespace
  const result = matcher.exec(formattedLine)

  if (!result) {
    console.log(`Sorry, didn't get that.`)
    return null
  }

  const [_, bookName, rawStartRef, rawEndRef] = result
  const [startChapter, startVerse] = rawStartRef.split(/:/)

  let endChapter
  let endVerse

  if (rawEndRef === '') { // Genesis 1:1
    endChapter = startChapter
    endVerse = startVerse
  } else {
    const splitEndRef = rawEndRef.split(/:/)

    if (splitEndRef.length === 1) { // Genesis 1:1-5
      endChapter = startChapter
      endVerse = splitEndRef[0]
    } else { // Genesis 1:1 - 2:10
      endChapter = splitEndRef[0]
      endVerse = splitEndRef[1]
    }
  }

  return {
    bookName,
    startRef: {
      chapter: parseInt(startChapter, 10),
      verse: parseInt(startVerse, 10),
    },
    endRef: {
      chapter: parseInt(endChapter, 10),
      verse: parseInt(endVerse, 10),
    },
  }
}

const formatPassage = serverData => serverData
  .map(({ chapterRef, verseRef, content }) => `[${chapterRef}:${verseRef}] ${content}`)
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
    const { bookName, startRef, endRef } = lineData
    const serverData = getPassage(bookName, startRef, endRef)
    const formattedData = formatPassage(serverData)

    console.log(formattedData)
  }

  readline.prompt()
}).on('close', () => console.log('\nGoodbye'))
