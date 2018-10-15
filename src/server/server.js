const fs = require('fs')
const R = require('ramda')

//
// Helpers
//

const nextId = (table) => {
  const largestId = R.reduce(R.max, 0, table)
  return largestId + 1
}

//
// Exports
//

const loadBook = (bookName) => {
  const path = `kjv-new/${bookName.toLowerCase()}.json`
  const data = fs.readFileSync(path)
  return JSON.parse(data)
}

const loadCrossReferences = () => {
  const path = 'local/crefs.json'
  if (!fs.existsSync(path)) return []
  const data = fs.readFileSync(path)
  return JSON.parse(data)
}

const addCrossReference = (ref1, ref2) => {
  const crefs = loadCrossReferences()
  const cref1Id = nextId(crefs)
  const cref2Id = cref1Id + 1

  const cref1 = R.pipe(
    R.assoc('id', cref1Id),
    R.assoc('refId', cref2Id),
  )(ref1)

  const cref2 = R.pipe(
    R.assoc('id', cref2Id),
    R.assoc('refId', cref1Id),
  )(ref2)

  fs.writeFileSync('local/crefs.json', JSON.stringify(
    R.pipe(
      R.append(cref1),
      R.append(cref2),
    )(crefs),
    null,
    2,
  ))
}

const deleteCrossReference = (id) => {
  const crefs = loadCrossReferences()
  const { refId } = R.find(R.propEq('id', id), crefs)
  fs.writeFileSync('local/crefs.json', JSON.stringify(
    R.reject(R.pipe(
      R.prop('id'),
      R.contains(R.__, [id, refId]),
    ), crefs),
    null,
    2,
  ))
}

module.exports = {
  loadBook,
  loadCrossReferences,
  addCrossReference,
  deleteCrossReference,
}
