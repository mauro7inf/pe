let LargeIntegerMatrix = require('./LargeIntegerMatrix');

let N = process.argv[2];

let debugOn = false; // set to true to enable debug

function debug(s) {
  if (!debugOn) {
    return;
  }
  console.log(s);
}

let T = new LargeIntegerMatrix(6, 6);

T.setCell(0, 0, 0);
T.setCell(0, 0, 1);
T.setCell(0, 0, 2);
T.setCell(1, 0, 3);
T.setCell(1, 0, 4);
T.setCell(0, 0, 5);

T.setCell(0, 1, 0);
T.setCell(0, 1, 1);
T.setCell(0, 1, 2);
T.setCell(1, 1, 3);
T.setCell(1, 1, 4);
T.setCell(0, 1, 5);

T.setCell(0, 2, 0);
T.setCell(0, 2, 1);
T.setCell(0, 2, 2);
T.setCell(1, 2, 3);
T.setCell(0, 2, 4);
T.setCell(0, 2, 5);

T.setCell(1, 3, 0);
T.setCell(1, 3, 1);
T.setCell(1, 3, 2);
T.setCell(0, 3, 3);
T.setCell(0, 3, 4);
T.setCell(1, 3, 5);

T.setCell(0, 4, 0);
T.setCell(0, 4, 1);
T.setCell(0, 4, 2);
T.setCell(1, 4, 3);
T.setCell(1, 4, 4);
T.setCell(0, 4, 5);

T.setCell(1, 5, 0);
T.setCell(1, 5, 1);
T.setCell(0, 5, 2);
T.setCell(0, 5, 3);
T.setCell(0, 5, 4);
T.setCell(1, 5, 5);

let m = Math.pow(10, 8);
let S = T.exponentMod(N - 1, m);

let answer = S.getCell(3, 3).add(S.getCell(3, 5)).mod(m);

console.log(answer.toString());