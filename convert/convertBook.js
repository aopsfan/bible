const fs = require('fs')

const bookName = process.argv[2]
const alias = process.argv[3]
const newBookName = bookName.toLowerCase()
const newAlias = alias.toLowerCase().trim()

const convertVerse = (verse) => {
  const keys = Object.keys(verse)
  if (keys.length !== 1) throw Error(`Found unexpected keys ${keys} for verse. Verse:\n\n${verse}`)
  const firstKey = keys[0]
  process.stdout.write('*')
  return verse[firstKey]
}

const convertChapter = (chapter) => {
  process.stdout.write(`--> Converting chapter ${chapter.chapter}: `)
  const result = chapter.verses.map(convertVerse)
  process.stdout.write('\n')
  return result
}

console.log(`> Parsing book ${bookName} as JSON`)
const data = JSON.parse(fs.readFileSync(`../kjv-old/${bookName}.json`))

console.log(`> Fetching chapters for ${bookName}`)
const { chapters } = data
console.log(`> Found ${chapters.length} chapter(s)`)

console.log('> Converting chapters')
const newChapters = chapters.map(convertChapter)
console.log('> Done converting chapters')

console.log('> Finishing up...')
const newData = {
  book: newBookName,
  alias: newAlias,
  content: newChapters,
}

console.log(`> Writing book ${newBookName} with alias ${newAlias}`)
fs.writeFile(`../kjv-new/${bookName}.json`, JSON.stringify(newData, null, 2), (err) => {
  if (err) {
    console.error(err)
    return
  }

  console.log('> Done writing book')
})
