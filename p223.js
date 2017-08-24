let NumberTheory = require('./NumberTheory');

let N = process.argv[2];

let total = 0;
let k = 2 + Math.sqrt(2);
for (let a = 1; k*a < N; a++) {
	if (a === 1) {
		total += Math.floor((N - 1)/2);
	} else if (a % 2 === 0) {
		let leftFactors = NumberTheory.factorProduct([a - 1, a + 1]);
		let factorPairs = NumberTheory.factorPairs(leftFactors);
		for (let i = 0; i < factorPairs.length; i++) {
			let p = factorPairs[i][0];
			let q = factorPairs[i][1];
			if (q + a <= N && q - p >= 2*a) {
				total++;
			}
		}
	} else if (a % 2 === 1) {
		let leftFactors = NumberTheory.factorProduct([(a - 1)/2, (a + 1)/2]);
		let factorPairs = NumberTheory.factorPairs(leftFactors);
		for (let i = 0; i < factorPairs.length; i++) {
			let p = 2*factorPairs[i][0];
			let q = 2*factorPairs[i][1];
			if (q + a <= N && q - p >= 2*a) {
				total++;
			}
		}
	}
	if (a % 10000 === 0) {
		console.log('a = ' + a + '; total = ' + total);
	}
}

console.log(total);