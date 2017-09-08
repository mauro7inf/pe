let NumberTheory = require('./NumberTheory');
let LargeInteger = require('./LargeInteger');

let NUM = +process.argv[2];
let DEN = +process.argv[3];

let R = 15499/94744;
console.log('R ≈ ' + R);

let product = 1;
let total = 1;
let i = 1;
while (product > R) {
  let p = NumberTheory.nthPrime(i);
  product *= (1 - (1/p));
  total *= p;
  if (product > R) {
    console.log('p = ' + p + '; ' + product + ' < ' + R + '; total = ' + total);
    i++;
  } else {
    console.log('p = ' + p + '; ' + product + ' > ' + R + '; total = ' + total);
  }
}

let multiple = 1;
let resilience = product*total*multiple/(total*multiple - 1);
while (resilience > R) {
  console.log('total = ' + total*multiple + '; ' + resilience + ' > ' + R);
  multiple++;
  resilience = product*total*multiple/(total*multiple - 1);
}
console.log('total = ' + total*multiple + '; ' + resilience + ' < ' + R);
