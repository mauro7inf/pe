let NumberTheory = require('./NumberTheory');
let BitArray = require('./BitArray');

let N = process.argv[2];
const steps = 10;

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
    if (a % 10 === 0) {
      console.log('[' + A + ' - ' + B + '] a = ' + a);
    }
    for (let b = Math.ceil(Math.sqrt((A - a*a)/7)); a*a + 7*b*b <= B; b++) {
      //console.log(NumberTheory.factor(a*a +7*b*b));
      //count7++;
      let number = a*a + 7*b*b;
      if (/*numbers1[a*a + 2*b*b]*/ number % 4 !== 3 && NumberTheory.canBeSumOfTwoSquares(number)) {
        numbers7.setBit(number);
      }
    }
  }

  console.log("1 and 7: " + numbers7.countBits() + "\n\n");

  let numbers3 = new BitArray();
  //let count3 = 0;

  for (let a = 1; a*a + 3 <= B; a++) {
    if (a % 100 === 0) {
      console.log('[' + A + ' - ' + B + '] a = ' + a);
    }
    for (let b = Math.ceil(Math.sqrt((A - a*a)/3)); a*a + 3*b*b <= B; b++) {
      //console.log(NumberTheory.factor(a*a + 3*b*b));
      //count3++;
      if (numbers7.getBit(a*a + 3*b*b)) {
        numbers3.setBit(a*a + 3*b*b);
      }
    }
  }

  console.log("1, 7, and 3: " + numbers3.countBits() + "\n\n");

  let numbers2 = new BitArray();
  //let count2 = 0;

  for (let a = 1; a*a + 2 <= B; a++) {
    if (a % 100 === 0) {
      console.log('[' + A + ' - ' + B + '] a = ' + a);
    }
    for (let b = Math.ceil(Math.sqrt((A - a*a)/2)); a*a + 2*b*b <= B; b++) {
      //console.log(NumberTheory.factor(a*a + 7*b*b));
      //count2++;
      if (numbers3.getBit(a*a + 2*b*b)) {
        numbers2.setBit(a*a + 2*b*b);
      }
    }
  }

  //console.log("2: " + count2 + "\n\n");
  let countTemp = numbers2.countBits();
  console.log("1, 7, 3, and 2: " + countTemp);
  return countTemp;
}

let count = 0;
for (let i = 0; i < steps; i++) {
  count += countInRange(Math.floor(i*N/steps) + 1, Math.floor((i + 1)*N/steps));
}

console.log('\nTotal: ' + count);
