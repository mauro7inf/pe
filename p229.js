let NumberTheory = require('./NumberTheory');
let BitArray = require('./BitArray');

let N = process.argv[2];
const steps = 200;

let debugOn = false; // set to true to enable debug

function debug(s) {
  if (!debugOn) {
    return;
  }
  console.log(s);
}

function countInRange(A, B) {

  let numbers7 = new BitArray();
  //let count7 = 0;

  for (let a = 1; a*a + 7 <= B; a++) {
    let bStart = a*a < A ? Math.ceil(Math.sqrt((A - a*a)/7)) : 1;
    if (a % 1000 === 0) {
      console.log('[' + A + ' - ' + B + '] 7: a = ' + a + ', b = ' + bStart);
    }
    for (let b = bStart; a*a + 7*b*b <= B; b++) {
      //console.log(NumberTheory.factor(a*a +7*b*b));
      //count7++;
      let number = a*a + 7*b*b;
      numbers7.setBit(number);
      /*if (number % 4 !== 3 && NumberTheory.canBeSumOfTwoSquares(number)) {
        numbers7.setBit(number);
      }*/
    }
  }

  let numbers3 = new BitArray();
  //let count3 = 0;

  for (let a = 1; a*a + 3 <= B; a++) {
    let bStart = a*a < A ? Math.ceil(Math.sqrt((A - a*a)/3)) : 1;
    if (a % 1000 === 0) {
      console.log('[' + A + ' - ' + B + '] 3: a = ' + a + ', b = ' + bStart);
    }
    for (let b = bStart; a*a + 3*b*b <= B; b++) {
      //console.log(NumberTheory.factor(a*a + 3*b*b));
      //count3++;
      if (numbers7.getBit(a*a + 3*b*b)) {
        numbers3.setBit(a*a + 3*b*b);
      }
    }
  }

  let numbers2 = new BitArray();
  //let count2 = 0;

  for (let a = 1; a*a + 2 <= B; a++) {
    let bStart = a*a < A ? Math.ceil(Math.sqrt((A - a*a)/2)) : 1;
    if (a % 1000 === 0) {
      console.log('[' + A + ' - ' + B + '] 2: a = ' + a + ', b = ' + bStart);
    }
    for (let b = bStart; a*a + 2*b*b <= B; b++) {
      //console.log(NumberTheory.factor(a*a + 7*b*b));
      //count2++;
      if (numbers3.getBit(a*a + 2*b*b)) {
        numbers2.setBit(a*a + 2*b*b);
      }
    }
  }

  let numbers1 = new BitArray();

  for (let a = 1; a*a + 2 <= B; a++) {
    let bStart = a*a < A ? Math.ceil(Math.sqrt(A - a*a)) : 1;
    if (a % 1000 === 0) {
      console.log('[' + A + ' - ' + B + '] 1: a = ' + a + ', b = ' + bStart);
    }
    for (let b = bStart; a*a + b*b <= B; b++) {
      if (numbers2.getBit(a*a + b*b)) {
        numbers1.setBit(a*a + b*b);
      }
    }
  }

  //console.log("2: " + count2 + "\n\n");
  let countTemp = numbers1.countBits();
  console.log(countTemp);
  return countTemp;
}

let count = 0;
for (let i = 0; i < steps; i++) {
  count += countInRange(Math.floor(i*N/steps) + 1, Math.floor((i + 1)*N/steps));
}

console.log('\nTotal: ' + count);
