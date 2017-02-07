const assert = require('assert')
const fs = require('fs')

const CountStream = require('./index.js')

const countStream = new CountStream('example')
let passed = 0

countStream.on('total', (count)=> {
  assert.equal(count, 1)
  passed++
})

fs.createReadStream(__filename).pipe(countStream)

process.on('exit', ()=> {
  console.log('Assertions passed:', passed)
})