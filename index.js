var Duplex = require('stream').Duplex
var inherits = require('inherits')

module.exports = function(pulsesize) {
  var self = this
  Duplex.call(self)
  this.pulsesize = pulsesize
}

inherits(module.exports, Duplex)y

module.exports.prototype._write = function(chunk, enc, next) {

  if(enc != 'buffer') {
    next(new Error("Unencoded strings are not currently supported"))
    return;
  }

  //Add to internal buffer
  if(Buffer.isBuffer(this.queued)) {
    this.queued = Buffer.concat([this.queued, chunk])
  }
  else {
    this.queued = chunk
  }
  next()
}

module.exports.prototype.pulse = function() {
  if(this.queued === null) {
    this.push(null)
    return;
  }
  if(this.queued)
  {
    if(this.pulsesize) {
      if(Buffer.isBuffer(this.ready))
        this.ready = Buffer.concat([this.ready, this.queued.slice(0, this.pulsesize)])
      else
        this.ready = this.queued.slice(0, this.pulsesize)
      this.queued = this.queued.slice(this.pulsesize)
    }
    else {
      //Prepare all pushed data
      if(Buffer.isBuffer(this.ready))
        this.ready = Buffer.concat([this.ready, this.queued])
      else
        this.ready = this.queued
      this.queued = undefined
    }
    //If we're currently being read from, push data
    if(this.reading)
    {
      this.reading = this.push(this.ready)
      this.ready = null
    }
  }
}

module.exports.prototype._read = function(size) {
  this.reading = true
}
