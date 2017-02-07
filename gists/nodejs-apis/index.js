const Writeable = require('stream').Writable
const util = require('util')

module.exports = CountStream

util.inherits(CountStream, Writeable)

function CountStream(matchText, options) {
  Writeable.call(this, options)
  this.count = 0
  this.matcher = new RegExp(matchText, 'ig')
}

CountStream.prototype._write = function(chunk, encoding, cb) {
  const matched = chunk.toString().match(this.matcher)
  if (matched) {
    this.count += matched.length
  }
  cb()
}
CountStream.prototype.end = function() {
  this.emit('total', this.count)
}