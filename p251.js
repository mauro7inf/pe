let NumberTheory = require('./NumberTheory');

let N = +(process.argv[2]);

function curt(x) {
	return Math.pow(x, 1/3);
}

let curt2 = curt(2);

let start = 1;
let end = 2;
while (1) {
	let s = 3*end - 1 + 1.5*curt2*curt(end)*curt(end)*curt(8*end - 3);
	if (s > N) {
		break;
	}
	start = end;
	end *= 2;
}
while (end - start > 0.1) {
	let mid = (start + end)/2;
	let s = 3*mid - 1 + 1.5*curt2*curt(mid)*curt(mid)*curt(8*mid - 3);
	if (s > N) {
		end = mid;
	} else {
		start = mid;
	}
}

let stepSize = 10000;
let AStart = 0;
let count = 0;
console.log('alpha end: ' + end);
for (let A = AStart; A < end; A += stepSize) {
	console.log('alpha = ' + A + ': ' + count);
	for (let alpha = 1 + A; alpha < end && alpha <= A + stepSize; alpha++) { // a = 3*alpha - 1
		let a = 3*alpha - 1;
		let m = 8*alpha - 3;
		let minSum = a + 1.5*curt2*curt(alpha)*curt(alpha)*curt(m);
		if (minSum > N + 1) {
			break;
		}
		let mFactors = NumberTheory.factor(m);
		let pFactors = NumberTheory.primeFactors(mFactors);
		let largestSquare = {};
		for (let i = 0; i < pFactors.length; i++) {
			let p = pFactors[i];
			if (mFactors[p] >= 2) {
				largestSquare[p] = Math.floor(mFactors[p]/2);
			}
		}
		let combined = NumberTheory.factorProduct([alpha, largestSquare]);
		let pairs = NumberTheory.factorPairs(combined);
		for (let i = 0; i < pairs.length; i++) {
			let endJ = 2;
			if (pairs[i][0] === pairs[i][1]) {
				endJ = 1;
			}
			for (let j = 0; j < endJ; j++) {
				let b = pairs[i][j];
				let cEstimate = (alpha/b)*(alpha/b)*m;
				if (a + b + cEstimate > 1.1*N) {
					continue;
				}
				let bFactors = NumberTheory.factor(b); // wastes time
				let cFactors = NumberTheory.factorProduct([alpha, alpha, m]);
				cFactors = NumberTheory.factorQuotient(cFactors, bFactors);
				cFactors = NumberTheory.factorQuotient(cFactors, bFactors);
				let c = NumberTheory.multiplyFactors(cFactors);
				if (a + b + c <= N) {
					count++;
					//console.log('(' + a + ', ' + b + ', ' + c + ') ' + (minSum/N));
				}
			}
		}
	}
}

console.log(count);
