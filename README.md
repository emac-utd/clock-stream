clock-stream
============

[![Build Status](https://travis-ci.org/emac-utd/clock-stream.png?branch=master)](https://travis-ci.org/emac-utd/clock-stream)

A duplex stream that holds onto data until it receives a "pulse."  Perfect for rationing pipes on a schedule.

Example
-------

```javascript
var CS = require('clock-stream')

var stream = new CS()
stream.write(new Buffer([1,2,3,4]))
stream.on('readable', function() {
  console.log(stream.read()) //<Buffer 01 02 03 04>, when it gets called
})

//Some other stuff

stream.pulse() //Will fire readable

var threeAtATime = new CS(3)
threeAtATime.write(new Buffer([1,2,3,4]))
threeAtATime.on('readable', function() {
  console.log(stream.read())
})

threeAtATime.pulse() //<Buffer 01 02 03>
threeAtATime.pulse() //<Buffer 04>

//Pulse is meant to be used in conjunction with EventEmitter#on
//midi-clock, for instance, can be used for metronome-esque functionality
var MidiClock = require('midi-clock')
var clock = MidiClock()
clock.on('position', threeAtATime.pulse)
```

API
---

In addition to the normal duplex stream methods, clock-stream offers:

###var CS = require('clock-stream')

Main class for clock-stream

### var stream = new CS([pulsesize])

Create a new stream, optionally specifying how many bytes to feed on each pulse

### stream.pulse()

Feed the previously specified number of bytes through the stream, or all currently queued data if no size was specified.

See also
--------

[Substack's Stream Handbook](https://github.com/substack/stream-handbook)

[Official Stream API docs](http://nodejs.org/api/stream.html)

[Official Buffer API docs](http://nodejs.org/api/buffer.html)

License
-------

MIT
