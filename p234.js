let NumberTheory = require('./NumberTheory');
let LargeInteger = require('./LargeInteger');

let N = process.argv[2];

let debugOn = false; // set to true to enable debug

function debug(s) {
  if (!debugOn) {
    return;
  }
  console.log(s);
}

let sum = new LargeInteger(0);
let count = 0;

let i = 2; // current prime
while (NumberTheory.nthPrime(i - 1)*NumberTheory.nthPrime(i - 1) <= N) {
	let p = NumberTheory.nthPrime(i - 1);
	let q = NumberTheory.nthPrime(i);
	if (i % 1000 === 0) {
		console.log('p = ' + p + ', q = ' + q);
	}
	for (let j = p + 1; p*j < q*q && p*j <= N; j++) {
		if (j === q) {
			continue;
		}
		sum = sum.add(p*j);
		count++;
	}
	for (let j = q - 1; q*j > p*p; j--) {
		if (j === p || q*j > N) {
			continue;
		}
		sum = sum.add(q*j);
		count++;
	}
	i++
}

console.log('Count: ' + count);
console.log('Sum: ' + sum.toString());