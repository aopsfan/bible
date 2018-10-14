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

const addCrossReference = (json) => {
  const crefs = loadCrossReferences()
  const newCref = R.assoc('id', nextId(crefs), json)
  fs.writeFileSync('local/crefs.json', JSON.stringify(
    R.append(newCref, crefs),
    null,
    2,
  ))

  return newCref
}

const deleteCrossReference = (id) => {
  const crefs = loadCrossReferences()
  fs.writeFileSync('local/crefs.json', JSON.stringify(
    R.reject(R.propEq('id', id), crefs),
    null,
    2,
  ))

  return id
}

module.exports = {
  loadBook,
  loadCrossReferences,
  addCrossReference,
  deleteCrossReference,
}
