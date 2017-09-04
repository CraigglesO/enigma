const Enigma = require('./lib/enigma').default;

let options = {
  rotors: [
    { type: "III", position: 13 }, // Right
    { type: "II",  position: 25 }, // Center
    { type: "I",   position: 14 }, // Left
  ],
  plugboard: [ 'AB', 'CD', 'EF', 'GK', 'MN' ],
  reflector: "B"
};

let enigma = new Enigma(options);

let c = enigma.encode("OBKRUOXOGHULBSOLIFBBWFLRVQQPRNGKSSOTWTQSJQSSEKZZWATJKLUDIAWINFBNYPVTTMZFPKWGDKZXTJCDIGKUHUAUEKCAR");
console.log("encrypted text", c);

// enigma = new Enigma();
//
// let m = enigma.decode(c);
// console.log("decrypt text", m);
