var cs = require('../index.js')
var stream
describe("An instance", function(){
  beforeEach(function(){
    stream = new cs()
    threeAtATime = new cs(3)
  })
  it("should be a duplex stream", function(){
    expect(typeof stream.write).toBe('function')
    expect(typeof stream.read).toBe('function')
    expect(typeof stream.pipe).toBe('function')
  })
  it("should push all available data after pulse is called when no size is given to the constructor", function(){
    stream.write(new Buffer([1,2,3]))
    stream.on('readable', function() {
      var buf = stream.read()
      expect(buf[0]).toEqual(1)
      expect(buf[1]).toEqual(2)
      expect(buf[2]).toEqual(3)
      expect(buf[3]).toBe(undefined)
    })
    stream.pulse()
  })
  it("should push only up to the number of bytes given at construction time on pulse", function(){
    threeAtATime.write(new Buffer([1,2,3,4]))
    var pulses = 0
    threeAtATime.on('readable', function() {
      var buf = threeAtATime.read()
      if(pulses === 0) {
        pulses++
        expect(buf[0]).toEqual(1)
        expect(buf[1]).toEqual(2)
        expect(buf[2]).toEqual(3)
        expect(buf[3]).toBe(undefined)
      }
      else
      {
        expect(buf[0]).toEqual(4)
        expect(buf[1]).toBe(undefined)
      }
    })
    threeAtATime.pulse()
    threeAtATime.pulse()
  })
  it("should push all ready data on read", function(){
    threeAtATime.write(new Buffer([1,2,3,4]))
    threeAtATime.pulse()
    threeAtATime.pulse()
    threeAtATime.on('readable', function() {
      var buf = threeAtATime.read()
      if(pulses === 0) {
        pulses++
        expect(buf[0]).toEqual(1)
        expect(buf[1]).toEqual(2)
        expect(buf[2]).toEqual(3)
        expect(buf[3]).toEqual(4)
        expect(buf[4]).toBe(undefined)
      }
    })
  })
})
