let NumberTheory = require('./NumberTheory');

let N = process.argv[2];
let R = process.argv[3]; // NCR

let debugOn = false; // set to true to enable debug

function debug(s) {
  if (!debugOn) {
    return;
  }
  console.log(s);
}

function primeSumNCR(n, r) {
  if (r > n - r) {
    return primeSumNCR(n, n - r);
  }
  if (r === 0) {
    return 0; // not applicable
  }
  let numerator = {};
  for (let i = n; i > n - r; i--) {
    numerator = NumberTheory.factorProduct([numerator, i]);
    if (i % 10000 === 0) {
      console.log('factoring ' + i);
    }
  }
  let denominator = {}
  for (let i = r; i > 1; i--) {
    denominator = NumberTheory.factorProduct([denominator, i]);
    if (i % 10000 === 0) {
      console.log('factoring ' + i);
    }
  }
  let dFactors = NumberTheory.primeFactors(denominator);
  for (let i = 0; i < dFactors.length; i++) {
    numerator[dFactors[i]] -= denominator[dFactors[i]];
  }
  let nFactors = NumberTheory.primeFactors(numerator);
  let sum = 0;
  for (let i = 0; i < nFactors.length; i++) {
    sum += nFactors[i]*numerator[nFactors[i]];
  }
  return sum;
}

console.log(primeSumNCR(N, R));
