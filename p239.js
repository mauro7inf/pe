/*Find P(N, k, k - r)/N! where N is total number, k special ones, k - r remain in place (N = 100, k = 25, r = 22)

P(N, k, k - r) = (kCr)P(N - (k - r), r, 0) = (kCr)Q(N - (k - r), r)

Q(M, 0) = M!
Q(M, 1) = (M - 1)(M - 1)!
Q(M, r) = (M - r)Q(M - 1, r - 1) + (r - 1)Q(M - 1, r - 2)*/

let Combinatorics = require('./Combinatorics');

let N = +process.argv[2];
let K = +process.argv[3];
let R = +process.argv[4];

let debugOn = false; // set to true to enable debug

function debug(s) {
  if (!debugOn) {
    return;
  }
  console.log(s);
}

let q = [];

function getQ(M, r) {
	if (M in q && r in q[M]) {
		return q[M][r];
	} else {
		return undefined;
	}
}

function setQ(value, M, r) {
	if (!(M in q)) {
		q[M] = [];
	}
	q[M][r] = value;
}

function Q(M, r) {
	if (getQ(M, r) !== undefined) {
		return getQ(M, r);
	}
	console.log('Q(' + M + ', ' + r + ')');
	if (r === 0) {
		setQ(Combinatorics.factorial(M), M, r);
		return getQ(M, r);
	} else if (r === 1) {
		setQ(Combinatorics.factorial(M - 1).multiply(M - 1), M, r);
		return getQ(M, r);
	} else {
		setQ(Q(M - 1, r - 1).multiply(M - r).add(Q(M - 1, r - 2).multiply(r - 1)), M, r);
		return getQ(M, r);
	}
}

let P = Combinatorics.nCr(K, R).multiply(Q(N - (K - R), R));
let nFactorial = Combinatorics.factorial(N);
console.log(P.toString());
console.log(nFactorial.toString());

let division = P.multiplyByPowerOf10(12).divide(nFactorial);
let quotient = division.quotient;
if (division.remainder.multiply(2).greaterThanOrEqualTo(nFactorial)) {
	quotient = quotient.add(1);
}

let quotientString = quotient.toString();
let l = quotientString.length;
for (let i = l + 1; i <= 12; i++) {
	quotientString = '0' + quotientString;
}
console.log('0.' + quotientString);