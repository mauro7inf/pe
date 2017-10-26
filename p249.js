let NumberTheory = require('./NumberTheory');
let LargeInteger = require('./LargeInteger');

let N = +(process.argv[2]);

let totals = {};

function addValue(total, value) {
	if (total in totals) {
		totals[total] = totals[total].add(value);
	} else {
		totals[total] = value;
	}
}

addValue(0, new LargeInteger(1));

for (let i = 1; NumberTheory.nthPrime(i) <= N; i++) {
	let p = NumberTheory.nthPrime(i);
	console.log('p = ' + p);
	let newTotals = {};
	let oldTotalsKeys = Object.keys(totals);
	for (let j = 0; j < oldTotalsKeys.length; j++) {
		let k = oldTotalsKeys[j];
		let v = totals[k];
		newTotals[(+k) + (+p)] = v;
	}
	let newTotalsKeys = Object.keys(newTotals);
	for (let j = 0; j < newTotalsKeys.length; j++) {
		let k = newTotalsKeys[j];
		addValue(k, newTotals[k]);
	}
}

console.log('Testing primes...');

let sum = new LargeInteger(0);
let totalsKeys = Object.keys(totals);
for (let i = 0; i < totalsKeys.length; i++) {
	let k = totalsKeys[i];
	if (NumberTheory.isPrime(k)) {
		console.log(k + ': ' + totals[k].toString());
		sum = sum.add(totals[k]);
	}
}

console.log(sum.toString());
