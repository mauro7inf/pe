let NumberTheory = require('./NumberTheory.js');

function Fraction(num, den) {
	if (den === undefined) {
		den = 1;
	}
	this.num = +num;
	this.den = +den;
	this.reduce();
}

Fraction.prototype.reduce = function () {
	if (this.den === 0) {
		if (this.num !== 0) {
			this.num = 1;
		}
	} else if (this.num === 0) {
		this.den = 1;
	}
	let d = NumberTheory.gcd(Math.abs(this.num), Math.abs(this.den));
	this.num /= d;
	this.den /= d;
	if (this.den < 0) {
		this.num *= -1;
		this.den *= -1;
	}

	return this;
};

Fraction.prototype.numerator = function () {
	return this.num;
};

Fraction.prototype.denominator = function () {
	return this.den;
};

Fraction.prototype.reciprocal = function () {
	return new Fraction(this.den, this.num);
};

Fraction.prototype.flipSign = function () {
	return new Fraction(-this.num, this.den);
};

Fraction.prototype.add = function (a) {
	if (!(a instanceof Fraction)) {
		a = new Fraction(a);
	}
	let d = NumberTheory.lcm(this.den, a.den);
	return new Fraction(this.num*(d/this.den) + a.num*(d/a.den), d);
};

Fraction.prototype.subtract = function (a) {
	if (!(a instanceof Fraction)) {
		a = new Fraction(a);
	}
	return this.add(a.flipSign());
};

Fraction.prototype.multiply = function (a) {
	if (!(a instanceof Fraction)) {
		a = new Fraction(a);
	}
	return new Fraction(this.num*a.num, this.den*a.den);
};

Fraction.prototype.divide = function (a) {
	if (!(a instanceof Fraction)) {
		a = new Fraction(a);
	}
	return this.multiply(a.reciprocal());
};

Fraction.prototype.toString = function () {
	return '' + this.num + '/' + this.den;
};

Fraction.prototype.equals = function (a) {
	if (!(a instanceof Fraction)) {
		a = new Fraction(a);
	}
	return this.num === a.num && this.den === a.den;
};

Fraction.prototype.lessThan = function (a) {
	if (!(a instanceof Fraction)) {
		a = new Fraction(a);
	}
	return this.num*a.den < a.num*this.den;
};

Fraction.prototype.greaterThan = function (a) {
	if (!(a instanceof Fraction)) {
		a = new Fraction(a);
	}
	return this.num*a.den > a.num*this.den;
};

Fraction.prototype.lessThanOrEqualTo = function (a) {
	return !this.greaterThan(a);
};

Fraction.prototype.greaterThanOrEqualTo = function (a) {
	return !this.lessThan(a);
};

module.exports = Fraction;