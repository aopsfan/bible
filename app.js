const readline = require('readline')
const R = require('ramda')
const refs = require('./src/helpers/refs')
const passages = require('./src/helpers/passages')

//
// Helpers
//

const readPassage = R.pipe(
  refs.make,
  passages.make,
  passages.addFormat,
  R.prop('format'),
  console.log,
)

const commandsMap = {
  read: readPassage,
}

//
// CLI Setup
//

const cli = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '+> ',
})

cli.prompt()

cli.on('line', (line) => {
  const [cmd, ...args] = line.split(' ')
  const commandFn = commandsMap[cmd]

  commandFn(args)
  cli.prompt()
}).on('close', () => console.log('\nGoodbye'))
