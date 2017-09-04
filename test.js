const Enigma = require('./lib/enigma').default;
const util = require('util')

let enigma = new Enigma();

let c = enigma.encode("TEST");
console.log("encrypted text", c);

enigma = new Enigma();

let m = enigma.decode(c);
console.log("decrypt text", m);
