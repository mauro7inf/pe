let LargeInteger = require('./LargeInteger');

function factorial(n) {
	let total = new LargeInteger(1);
	for (let i = 1; i <= n; i++) {
		total = total.multiply(i);
	}
	return total;
}

function nCr(n, r) {
	if (n - r < r) {
		return nCr(n, n - r);
	}
	let total = new LargeInteger(1);
	for (let i = 1; i <= r; i++) {
		total = total.multiply(n + 1 - i);
		total = total.divide(i).quotient;
	}
	return total;
}

module.exports = {
	factorial: factorial,
	nCr: nCr
};