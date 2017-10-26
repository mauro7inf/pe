let Combinatorics = require('./Combinatorics');
let LargeInteger = require('./LargeInteger');
let N = +(process.argv[2]);

// we'll find the sum of 2^b(a) for a from 0 to floor(N - 1)/4,
// where b(a) is the number of set bits in the number
let n = Math.floor((N - 1)/4);
let bin = '';
while (n) {
  bin = '' + (n % 2) + bin;
  n = (n - (n % 2))/2;
}

function printB() {
  console.log('[' + b.map((e) => {return e.toString()}).join(',') + ']');
}

let b = [];
b[0] = new LargeInteger(1);
for (let i = 1; i <= bin.length; i++) {
  b[i] = new LargeInteger(0);
}

for (let i = bin.length - 1; i >= 0; i--) {
  if (bin[i] === '0') {
    continue;
  }
  let setLeftBits = 0;
  for (let j = 0; j < i; j++) {
    if (bin[j] === '1') {
      setLeftBits++;
    }
  }
  let rightBits = bin.length - i - 1;
  for (let j = 1; j <= rightBits; j++) {
    b[setLeftBits + j] = b[setLeftBits + j].add(Combinatorics.nCr(rightBits, j));
  }
  b[setLeftBits + 1] = b[setLeftBits + 1].add(1);
}

let total = new LargeInteger(0);
for (let i = 0; i < b.length; i++) {
  let two = new LargeInteger(2);
  total = total.add(two.exponent(i).multiply(b[i]));
}

console.log(total.toString());
