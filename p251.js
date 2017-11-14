let NumberTheory = require('./NumberTheory');

let N = +(process.argv[2]);

let count = 0;
for (let a = 1;; a++) {
	let left = 8*a*a*a + 15*a*a + 6*a;
	let m = (left - 1)/27;
	let portion = (a + 1.5*Math.pow(2*m, 1/3))/N;
	if (portion > 1) {
		break;
	}
	if ((left - 1) % 27 !== 0) {
		continue;
	}
	let mFactors = NumberTheory.factor(m);
	let pFactors = NumberTheory.primeFactors(mFactors);
	let largestSquare = 1;
	for (let i = 0; i < pFactors.length; i++) {
		let p = pFactors[i]
		let f = mFactors[p];
		let power = Math.floor(f/2);
		largestSquare *= Math.pow(p, power);
	}
	let squarePairs = NumberTheory.factorPairs(largestSquare);
	let squares = [];
	for (let i = 0; i < squarePairs.length; i++) {
		squares.push(squarePairs[i][0]);
		if (squarePairs[i][0] !== squarePairs[i][1]) {
			squares.push(squarePairs[i][1]);
		}
	}
	for (let i = 0; i < squares.length; i++) {
		let b = squares[i];
		let c = m/(b*b);
		if (a + b + c <= N) {
			console.log('(' + a + ', ' + b + ', ' + c + ') ' + portion);
			count++;
		}
	}
}

console.log(count);