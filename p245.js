let NumberTheory = require('./NumberTheory');

let N = +process.argv[2];

let sum = 0;

function realizeArray(a) {
  let total = 1;
  for (let i = 0; i < a.length; i++) {
    total *= NumberTheory.nthPrime(a[i]);
  }
  return total;
}

function incrementArray(a) {
  let b = a.slice();
  let t = realizeArray(b);
  let nextPrimeIndex = b[b.length - 1] + 1;
  if (t*NumberTheory.nthPrime(nextPrimeIndex) <= N) {
    b.push(nextPrimeIndex);
    return b;
  }
  while (b.length > 1) {
    b[b.length - 1]++;
    if (realizeArray(b) <= N) {
      return b;
    }
    b.pop();
  }
  b[0]++;
  b.push(b[0] + 1);
  if (realizeArray(b) <= N) {
    return b;
  }
  return null;
}

function printArray(a) {
  let msg = '';
  for (let i = 0; i < a.length; i++) {
    msg += '' + NumberTheory.nthPrime(a[i]);
    if (i < a.length - 1) {
      msg += '·';
    }
  }
  return msg;
}

let a = [1, 2];
while (a) {
  let t = realizeArray(a);
  let den = t - 1;
  let phi = t;
  for (let i = 0; i < a.length; i++) {
    let p = NumberTheory.nthPrime(a[i]);
    phi = (phi/p)*(p - 1);
  }
  let num = t - phi;
  if (den % num === 0) {
    sum += t;
    console.log('' + t + ' = ' + printArray(a));
  }
  a = incrementArray(a);
}

console.log(sum);
