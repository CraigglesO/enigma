const reflectorOptions = require('./settings/reflector.json');

const CHAR_NUM = {
  "A": 0, "B": 1, "C": 2, "D": 3, "E": 4, "F": 5, "G": 6, "H": 7, "I": 8, "J": 9,
  "K": 10, "L": 11, "M": 12, "N": 13, "O": 14, "P": 15, "Q": 16, "R": 17, "S": 18,
  "T": 19, "U": 20, "V": 21, "W": 22, "X": 23, "Y": 24, "Z": 25
}

let res = [];

let C = reflectorOptions["C_FLAT"];
Object.keys(C).forEach((num, i) => {
  res[num] = C[num];
});
// let res = rotorOptions;

console.log("res", JSON.stringify(res));
