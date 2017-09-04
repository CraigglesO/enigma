// @flow
import rotorOptions     from '../settings/rotor.json';
import reflectorOptions from '../settings/reflector.json';
import extend           from 'extend';

const NUM_CHAR = {
  "0":"A", "1":"B", "2":"C", "3":"D", "4":"E", "5":"F", "6":"G", "7":"H", "8":"I",
	"9":"J", "10":"K", "11":"L", "12":"M", "13":"N", "14":"O", "15":"P", "16":"Q",
	"17":"R", "18":"S", "19":"T", "20":"U", "21":"V", "22":"W", "23":"X", "24":"Y",
	"25":"Z"
};
const CHAR_NUM = {
  "A": 0, "B": 1, "C": 2, "D": 3, "E": 4, "F": 5, "G": 6, "H": 7, "I": 8, "J": 9,
  "K": 10, "L": 11, "M": 12, "N": 13, "O": 14, "P": 15, "Q": 16, "R": 17, "S": 18,
  "T": 19, "U": 20, "V": 21, "W": 22, "X": 23, "Y": 24, "Z": 25
};
const ROTOR_SIZE = 26;

type Rotor = {
  type:     string,
  position: number,
  map:      Array<number>,
  rev_map:  Array<number>,
  step:     string
}

type RotorOptions = {
  type: string,
  position: number
}

type Options = {
  rotors:    Array<RotorOptions>,
  plugboard: Array<string>,
  reflector: string,
  spacing?:  number
}

const defaultOptions = {
  rotors: [
    { type: "III", position: 0 }, // Right
    { type: "II",  position: 0 }, // Center
    { type: "I",   position: 0 }, // Left
  ],
  plugboard: [
    "AB",
    "CD",
    "EF",
    "GH"
  ],
  reflector: "B"
};

class Enigma {
  rotors:    Rotors;
  plugboard: { [key: number]: number }
  reflector: string;
  constructor(opts?: Options) {
    opts = extend(defaultOptions, opts);

    this.rotors    = new Rotors(opts.rotors, opts.reflector);
    this.plugboard = setupPlugBoard(opts.plugboard);
  }

  encode(m: string): string {
    m = m.toUpperCase().replace(/\s/g, ''); // remove spaces, and only use uppercase
    let ciphertext = "";
    for (let i = 0; i < m.length; i++) {
      // increment rotors
      this.rotors.increment();
      // run through 'components'
      // m->plugboard->rotors->reflector->reverse-rotors->plugboard->c
      let c = this.plugB(CHAR_NUM[m[i]]);
      c     = this.rotors.input(c).forward().reflect().reverse();
      ciphertext += NUM_CHAR[this.plugB(c)];
    }
    return ciphertext;
  }

  decode(c: string): string {
    return this.encode(c);
  }

  plugB(c: number): number {
    if (c in this.plugboard)
      return this.plugboard[c]
    return c;
  }
}

class Rotors {
  rotors:    Array<Rotor>;
  reflector: Array<number>;
  c:         number;
  constructor(rotors: Array<Rotor>, reflector: string) {
    this.rotors    = rotors.map(rotor => extend(rotorOptions[rotor.type], rotor));
    this.reflector = reflectorOptions[reflector];
  }

  input(c: number): Rotors {
    this.c = c;
    return this;
  }

  increment() {
    this.rotate(this.rotors[0]);
  }

  rotate(r: Rotor, index: number = 0) {
    if (!r)
      return;
    r.position = (r.position + 1) % ROTOR_SIZE;
    if (r.position === r.step[0] || r.position === r.step[1])
      this.rotate(this.rotors[index+1], index+1);
  }

  forward(): Rotors {
    this.rotors.forEach(rotor => {
      this.c = rotor.map[(this.c + rotor.position) % ROTOR_SIZE];
      this.c = modulo(this.c - rotor.position, ROTOR_SIZE);
    });
    return this;
  }

  reverse(): number {
    this.rotors.reverse().forEach(rotor => {
      this.c = rotor.rev_map[(this.c + rotor.position) % ROTOR_SIZE];
      this.c = modulo(this.c - rotor.position, ROTOR_SIZE);
    });
    this.rotors.reverse();
    return this.c;
  }

  reflect(): Rotors {
    this.c = this.reflector[this.c];
    return this;
  }
}

function setupPlugBoard(input: Array<string>): { [key: number]: number } {
  let r = {};
  input.forEach(pair => {
    let p0 = CHAR_NUM[pair[0]], p1 = CHAR_NUM[pair[1]];
    r[p0] = p1;
    r[p1] = p0;
  });
  return r;
}

function modulo(n, m) {
  return ((n % m) + m) % m;
}

export default Enigma;
