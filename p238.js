let LargeInteger = require('./LargeInteger');
let NumberTheory = require('./NumberTheory');

let N = process.argv[2];

let debugOn = false; // set to true to enable debug

function debug(s) {
  if (!debugOn) {
    return;
  }
  console.log(s);
}

let m = 20300713;
let s = 14025256;
let cm = NumberTheory.carmichael(m);
let cmcm = NumberTheory.carmichael(cm); // period of BBS

let digitSum = 0;
let digitCount = 0;
let b = s;
for (let i = 0; i < cmcm; i++) {
  digitSum += NumberTheory.digitSum(b);
  digitCount += NumberTheory.digitCount(b);
  b = (b * b) % m;
}

console.log('setting up digit sum array...');
let ks = new Array(digitSum + 1);
for (let i = 0; i <= digitSum; i++) {
  ks[i] = 0;
}

console.log('setting up cumulative sums...');
let cumulativeSums = new Array(digitCount);
b = s;
let d = 0;
let cumulativeSum = 0;
for (let i = 0; i < cmcm; i++) {
  let bString = '' + b;
  for (let j = 0; j < bString.length; j++) {
    cumulativeSum += +(bString.charAt(j));
    cumulativeSums[d++] = cumulativeSum;
  }
  b = (b * b) % m;
}

console.log('filling in p values');
let earliestZero = 1;
console.log('earliest zero: ' + earliestZero);
let sumOfValues = 0;
for (let p = 1; earliestZero > 0; p++) {
  console.log('p = ' + p);
  let pCount = 0;
  let difference = 0;
  if (p > 1) {
    difference = cumulativeSums[p - 2];
  }
  for (let i = 0; i <= digitCount; i++) {
    let k;
    if (p - 1 + i > digitCount) {
      k = cumulativeSums[p - 1 + i - digitCount] - difference + digitSum;
    } else {
      k = cumulativeSums[p - 1 + i] - difference;
    }
    if (k <= digitSum && ks[k] === 0 && k !== 0) {
      ks[k] = p;
      pCount++;
      if (k === earliestZero) {
        earliestZero = 0;
        for (let l = k + 1; l < ks.length && earliestZero === 0; l++) {
          if (ks[l] === 0) {
            earliestZero = l;
            console.log('earliest zero: ' + earliestZero);
          }
        }
      }
    }
  }
  console.log(pCount + ' values (sum = ' + (p*pCount) + ')');
  sumOfValues += p*pCount;
}
console.log('(sum of values = ' + sumOfValues + ')')

console.log('computing iteration total...');
let iterationTotal = 0;
for (let i = 1; i <= digitSum; i++) {
  iterationTotal += ks[i];
}

console.log('computing remainder total...');
let largeN = new LargeInteger(N);
let division = largeN.divide(digitSum);
let remainder = +(division.remainder.toString());
let quotient = division.quotient;

let remainderTotal = 0;
for (let i = 1; i <= remainder; i++) {
  remainderTotal += ks[i];
}

console.log('answer:');
let answer = quotient.multiply(iterationTotal).add(remainderTotal);
console.log(quotient.toString() + '·' + (iterationTotal) + ' + ' + remainderTotal + ' = ' + answer.toString());
