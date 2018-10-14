const { getPassageFromInput } = require('./src/client/client')
const { formatWithBracketedReference } = require('./src/api/decorators')
const R = require('ramda')

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
  const passage = getPassageFromInput(line)

  if (passage) {
    const formattedData = R
      .map(R.pipe(
        formatWithBracketedReference,
        R.prop('format'),
      ), passage)
      .join(' ')

    console.log(formattedData)
    console.log('\n')
  } else {
    console.log(`Sorry, didn't get that`)
  }

  readline.prompt()
}).on('close', () => console.log('\nGoodbye'))
