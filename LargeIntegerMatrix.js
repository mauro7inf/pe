let LargeInteger = require('./LargeInteger');

function LargeIntegerMatrix(m, n) {
	this.rows = m;
	this.cols = n;
	this.matrix = [];
}

LargeIntegerMatrix.prototype.getCell = function (r, c) {
	return this.matrix[this.cols*r + c];
};

LargeIntegerMatrix.prototype.setCell = function (value, r, c) {
	if (!(value instanceof LargeInteger)) {
		value = new LargeInteger(value);
	}
	this.matrix[this.cols*r + c] = value;
	return this;
};

LargeIntegerMatrix.prototype.toString = function () {
	let string = '';
	for (let r = 0; r < this.rows; r++) {
		for (let c = 0; c < this.cols; c++) {
			string += this.getCell(r, c).toString();
			if (c !== this.cols - 1) {
				string += ', ';
			}
		}
		if (r !== this.rows - 1) {
			string += '\n';
		}
	}
	return string;
};

LargeIntegerMatrix.prototype.copy = function () {
	let copy = new LargeIntegerMatrix(this.rows, this.cols);
	for (let r = 0; r < this.rows; r++) {
		for (let c = 0; c < this.rows; c++) {
			copy.setCell(this.getCell(r, c), r, c);
		}
	}
	return copy;
}

LargeIntegerMatrix.identity = function (n) {
	let id = new LargeIntegerMatrix(n, n);
	for (let i = 0; i < n; i++) {
		for (let j = 0; j < n; j++) {
			if (i !== j) {
				id.setCell(new LargeInteger(0), i, j);
			} else {
				id.setCell(new LargeInteger(1), i, j);
			}
		}
	}
	return id;
}

LargeIntegerMatrix.prototype.multiply = function (a) {
	if (this.cols !== a.rows) {
		return undefined;
	}
	let product = new LargeIntegerMatrix(this.rows, a.cols);
	for (let r = 0; r < this.rows; r++) {
		for (let c = 0; c < a.cols; c++) {
			let p = new LargeInteger(0);
			for (let i = 0; i < this.cols; i++) {
				p = p.add(this.getCell(r, i).multiply(a.getCell(i, c)));
			}
			product.setCell(p, r, c);
		}
	}
	return product;
}

LargeIntegerMatrix.prototype.multiplyMod = function (a, m) {
	if (this.cols !== a.rows) {
		return undefined;
	}
	let product = new LargeIntegerMatrix(this.rows, a.cols);
	for (let r = 0; r < this.rows; r++) {
		for (let c = 0; c < a.cols; c++) {
			let p = new LargeInteger(0);
			for (let i = 0; i < this.cols; i++) {
				p = p.add(this.getCell(r, i).multiply(a.getCell(i, c)).mod(m)).mod(m);
			}
			product.setCell(p, r, c);
		}
	}
	return product;
};

// regular integer
LargeIntegerMatrix.prototype.exponentMod = function (a, m) {
	if (this.rows !== this.cols) {
		return null;
	}
	if (a === 0) {
	    return new LargeIntegerMatrix.identity(this.rows);
	}
	let powers = [
	  {exponent: 1, power: this.copy()}
	];
	while (2*powers[powers.length - 1].exponent <= a) {
	  let currentPower = powers[powers.length - 1];
	  powers.push({
	    exponent: currentPower.exponent*2,
	    power: currentPower.power.multiplyMod(currentPower.power, m)
	  });
	}
	let ar = a;
	let p = powers.length - 1;
	let total = LargeIntegerMatrix.identity(this.rows);
	while (ar > 0) {
	  if (powers[p].exponent <= ar) {
	    ar -= powers[p].exponent;
	    total = total.multiplyMod(powers[p].power, m);
	  }
	  p--;
	}
	return total;
};

module.exports = LargeIntegerMatrix;
