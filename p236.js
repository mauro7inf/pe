let NumberTheory = require('./NumberTheory.js');
let Fraction = require('./Fraction.js');

let debugOn = false; // set to true to enable debug

function debug(s) {
  if (!debugOn) {
    return;
  }
  console.log(s);
}

function allFactors(n) {
	let fPairs = NumberTheory.factorPairs(n);
	let factors = [];
	for (let i = 0; i < fPairs.length; i++) {
		factors = factors.concat(fPairs[i]);
	}
	return factors;
}

function getAlpha(a1, b1, a4, b4, m) {
	let M = m.multiply(new Fraction(59, 41));
	let p = M.numerator();
	let q = M.denominator();
	let num = 6*q*q*(a1 + a4) - 5*p*q*(b1 + b4);
	let den = 5*p*p - 6*q*q;
	return new Fraction(num, den);
}

let possibilities = [];

for (let alpha1 = 1; 2419*alpha1 <= 5248; alpha1++) {
	for (let beta4 = 1; beta4 <= 3776; beta4++) {
		let numerator = alpha1*beta4*450;
		let factors = allFactors(numerator);
		for (let i = 0; i < factors.length; i++) {
			let b1 = factors[i];
			let a4 = numerator/b1;
			let a1 = 2419*alpha1;
			let b4 = beta4;
			if (b1 <= 640 && a4 <= 5760) {
				let m = (new Fraction(b1, a1)).multiply(new Fraction(41, 5));
				let alpha = getAlpha(a1, b1, a4, b4, m);
				if (m.greaterThan(1) && alpha.numerator() > 0 && alpha.denominator() === 1) {
					debug('a1 = ' + a1 + ', b1 = ' + b1 + ', a4 = ' + a4 + ', b4 = ' + b4 + ', m = ' + m.toString() + ', alpha = ' + alpha);
					possibilities.push({
						a1: a1,
						b1: b1,
						a4: a4,
						b4: b4,
						m: m,
						alpha: alpha
					});
				}
			}
		}
	}
}

for (let alpha1 = 1; alpha1 <= 5248; alpha1++) {
	for (let beta4 = 1; 2419*beta4 <= 3776; beta4++) {
		let numerator = alpha1*beta4*450;
		let factors = allFactors(numerator);
		for (let i = 0; i < factors.length; i++) {
			let b1 = factors[i];
			let a4 = numerator/b1;
			let a1 = alpha1;
			let b4 = 2419*beta4;
			if (b1 <= 640 && a4 <= 5760) {
				let m = (new Fraction(b1, a1)).multiply(new Fraction(41, 5));
				let alpha = getAlpha(a1, b1, a4, b4, m);
				if (m.greaterThan(1) && alpha.numerator() > 0 && alpha.denominator() === 1) {
					debug('a1 = ' + a1 + ', b1 = ' + b1 + ', a4 = ' + a4 + ', b4 = ' + b4 + ', m = ' + m.toString() + ', alpha = ' + alpha);
					possibilities.push({
						a1: a1,
						b1: b1,
						a4: a4,
						b4: b4,
						m: m,
						alpha: alpha
					});
				}
			}
		}
	}
}

for (let alpha1 = 1; 41*alpha1 <= 5248; alpha1++) {
	for (let beta4 = 1; 59*beta4 <= 3776; beta4++) {
		let numerator = alpha1*beta4*450;
		let factors = allFactors(numerator);
		for (let i = 0; i < factors.length; i++) {
			let b1 = factors[i];
			let a4 = numerator/b1;
			let a1 = 41*alpha1;
			let b4 = 59*beta4;
			if (b1 <= 640 && a4 <= 5760) {
				let m = (new Fraction(b1, a1)).multiply(new Fraction(41, 5));
				let alpha = getAlpha(a1, b1, a4, b4, m);
				if (m.greaterThan(1) && alpha.numerator() > 0 && alpha.denominator() === 1) {
					debug('a1 = ' + a1 + ', b1 = ' + b1 + ', a4 = ' + a4 + ', b4 = ' + b4 + ', m = ' + m.toString() + ', alpha = ' + alpha);
					possibilities.push({
						a1: a1,
						b1: b1,
						a4: a4,
						b4: b4,
						m: m,
						alpha: alpha
					});
				}
			}
		}
	}
}

for (let alpha1 = 1; 59*alpha1 <= 5248; alpha1++) {
	for (let beta4 = 1; 41*beta4 <= 3776; beta4++) {
		let numerator = alpha1*beta4*450;
		let factors = allFactors(numerator);
		for (let i = 0; i < factors.length; i++) {
			let b1 = factors[i];
			let a4 = numerator/b1;
			let a1 = 59*alpha1;
			let b4 = 41*beta4;
			if (b1 <= 640 && a4 <= 5760) {
				let m = (new Fraction(b1, a1)).multiply(new Fraction(41, 5));
				let alpha = getAlpha(a1, b1, a4, b4, m);
				if (m.greaterThan(1) && alpha.numerator() > 0 && alpha.denominator() === 1) {
					debug('a1 = ' + a1 + ', b1 = ' + b1 + ', a4 = ' + a4 + ', b4 = ' + b4 + ', m = ' + m.toString() + ', alpha = ' + alpha);
					possibilities.push({
						a1: a1,
						b1: b1,
						a4: a4,
						b4: b4,
						m: m,
						alpha: alpha
					});
				}
			}
		}
	}
}

let ms = [];

for (let i = 0; i < possibilities.length; i++) {
	let m = possibilities[i].m;
	let found = false;
	for (let j = 0; j < ms.length; j++) {
		if (ms[j].equals(m)) {
			found = true;
			break;
		}
	}
	if (!found) {
		ms.push(m);
	}
}

function compareFractions(a, b) {
	if (a.lessThan(b)) {
		return -1;
	} else if (a.equals(b)) {
		return 0;
	} else {
		return 1;
	}
}

ms.sort(compareFractions);

for (let i = 0; i < ms.length; i++) {
	console.log(ms[i].toString());
}