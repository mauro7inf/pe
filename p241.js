let NumberTheory = require('./NumberTheory');
let LargeInteger = require('./LargeInteger');

let N = +process.argv[2];

for (let n = 1; n <= N; n++) {
  let s = NumberTheory.sumOfFactors(n);
  let r = (s/n - 1/2);
  if (r == Math.floor(r)) {
    console.log('n = ' + n + ', p(n) = ' + r + ' 1/2');
    console.log(NumberTheory.factor(n));
  }
  if (Math.floor(s/n) == s/n) {
    console.log('n = ' + n + ', p(n) = ' + s/n);
    console.log(NumberTheory.factor(n));
  }
}
