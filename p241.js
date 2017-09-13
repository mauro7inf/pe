let NumberTheory = require('./NumberTheory');
let LargeInteger = require('./LargeInteger');

let N = +process.argv[2];

for (let n = 1; n <= N; n++) {
  let s = NumberTheory.sumOfFactors(n);
  let r = (s/n - 1/2);
  if (r == Math.floor(r)) {
    console.log('n = ' + n + ', p(n) - 1/2 = ' + r);
    console.log(NumberTheory.factor(n));
  }
}
