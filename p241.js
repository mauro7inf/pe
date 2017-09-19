let NumberTheory = require('./NumberTheory');
let LargeInteger = require('./LargeInteger');

let N = new LargeInteger(process.argv[2]);
console.log(N.toString());

/*for (let n = 1; n <= N; n++) {
  let s = NumberTheory.sumOfFactors(n);
  let r = (s/n - 1/2);
  if (r == Math.floor(r)) {
    console.log('----n = ' + n + ', p(n) = ' + r + ' 1/2');
    console.log(NumberTheory.factor(n));
  }
  if (Math.floor(s/n) == s/n) {
    //console.log('\t\tn = ' + n + ', p(n) = ' + s/n);
    //console.log(NumberTheory.factor(n));
  }
}*/

function multiplyFactors(a) { // with LargeInteger instances
  let pFactors = NumberTheory.primeFactors(a);
  let total = new LargeInteger(1);
  for (let i = 0; i < pFactors.length; i++) {
    for (let j = 0; j < a[pFactors[i]]; j++) {
      total = total.multiply(pFactors[i]);
    }
  }
  return total;
}

for (let a = 1; a <= 52; a++) { // can't go higher with floats
  console.log('2^' + a + ' = ' + multiplyFactors({2: a}).toString());
  console.log('  sum: ' + NumberTheory.sumOfFactors({2: a}));
  let saFactors = NumberTheory.factor(NumberTheory.sumOfFactors({2: a}));
}
