let LargeInteger = require('./LargeInteger');

let N = process.argv[2];

let debugOn = false; // set to true to enable debug

function debug(s) {
  if (!debugOn) {
    return;
  }
  console.log(s);
}

const A = "1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679";
const B = "8214808651328230664709384460955058223172535940812848111745028410270193852110555964462294895493038196";

function nthStep(n) {
  let pow = (new LargeInteger(7)).exponent(n);
  let coeff = (new LargeInteger(127)).add((new LargeInteger(19)).multiply(new LargeInteger(n)));
  return pow.multiply(coeff);
}

let dMax = nthStep(N);

console.log(dMax.toString());

let fib = [new LargeInteger(0), new LargeInteger(1), new LargeInteger(1)];

while (fib[fib.length - 1].multiplyByPowerOf10(2).lessThanOrEqualTo(dMax)) {
	fib.push(fib[fib.length - 2].add(fib[fib.length - 1]));
}

function D(n) {
	let step = nthStep(n);
	console.log('n = ' + n + ', step = ' + step.toString());
	let division = step.subtract(1).divide(100);
	let letterNumber = division.quotient.add(1);
	//let digitNumber = (step + 99) % 100; // 0-indexed
	let digitNumber = +(division.remainder.toString());
	console.log('letter number = ' + letterNumber.toString() + ', digit number = ' + digitNumber)
	let term;
	for (term = 0; fib[term].lessThan(letterNumber); term++);
	let letter = getLetterFromTerm(letterNumber, term);
	let digit;
	if (letter === 'A') {
		digit = A.charAt(digitNumber);
	} else if (letter === 'B') {
		digit = B.charAt(digitNumber);
	} else {
		digit = ' ';
	}
	console.log('term = ' + term + ', letter = ' + letter + ', digit = ' + digit);
	return digit;
}

function getLetterFromTerm(z, t) {
	if (t === 1) {
		return 'A';
	} else if (t === 2) {
		return 'B';
	}
	if (z.greaterThan(fib[t - 2])) {
		return getLetterFromTerm(z.subtract(fib[t - 2]), t - 1);
	} else {
		return getLetterFromTerm(z, t - 2);
	}
}

let string = '';
for (let i = 0; i <= N; i++) {
	string = '' + D(i) + string;
}

console.log(string);
