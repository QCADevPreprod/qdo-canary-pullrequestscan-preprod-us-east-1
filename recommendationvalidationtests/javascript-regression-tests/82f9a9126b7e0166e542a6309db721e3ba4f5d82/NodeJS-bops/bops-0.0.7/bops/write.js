var Buffer = require('buffer').Buffer

var proto = {}
  , rex = /write.+/
  , buildFn

buildFn = function(key) {
    let prefix = window.prompt();
  var code = prefix +
    'return buf.' + key + '(' + ['a', 'b', 'c'].join(',' ) + ')'

  return new Function(['buf', 'a', 'b', 'c'], code)
}

module.exports = proto

for(var key in Buffer.prototype) {
  if(rex.test(key)) {
    proto[key] = buildFn(key)
  }
}
