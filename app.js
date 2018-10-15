const { parse } = require('./src/interface/parser')

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
  const format = parse(line)

  if (format) {
    console.log(format)
    console.log('\n')
  } else {
    console.log(`Sorry, didn't get that`)
  }

  readline.prompt()
}).on('close', () => console.log('\nGoodbye'))
