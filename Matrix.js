function Matrix(m, n) {
	this.rows = m;
	this.cols = n;
	this.matrix = [];
}

Matrix.prototype.getCell = function (r, c) {
	return this.matrix[this.cols*r + c];
};

Matrix.prototype.setCell = function (value, r, c) {
	this.matrix[this.cols*r + c] = value;
	return this;
};

Matrix.prototype.toString = function () {
	let string = '';
	for (let r = 0; r < this.rows; r++) {
		for (let c = 0; c < this.cols; c++) {
			string += this.getCell(r, c);
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

// multiply row r by k
Matrix.prototype.scaleRow = function(r, k) {
	for (let c = 0; c < this.cols; c++) {
		let entry = this.getCell(r, c);
		this.setCell(k*entry, r, c);
	}
	return this;
};

// add row r1 times k to row r2
Matrix.prototype.addMultipleOfRowToRow = function (r1, k, r2) {
	for (let c = 0; c < this.cols; c++) {
		let entry1 = this.getCell(r1, c);
		let entry2 = this.getCell(r2, c);
		this.setCell(entry2 + k*entry1, r2, c);
	}
	return this;
};

// switch rows r1 and r2
Matrix.prototype.switchRows = function (r1, r2) {
	for (let c = 0; c < this.cols; c++) {
		let entry1 = this.getCell(r1, c);
		let entry2 = this.getCell(r2, c);
		this.setCell(entry1, r2, c);
		this.setCell(entry2, r1, c);
	}
	return this;
};

Matrix.prototype.gaussJordan = function () {
	let topRow = 0;
	for (let pivot = 0; pivot < this.cols && topRow < this.rows; pivot++) {
		if (this.getCell(topRow, pivot) === 0) {
			for (let rowToSwitch = topRow + 1; rowToSwitch < this.rows; rowToSwitch++) {
				if (this.getCell(rowToSwitch, pivot) !== 0) {
					this.switchRows(topRow, rowToSwitch);
					break;
				}
			}
		}
		if (this.getCell(topRow, pivot) === 0) {
			continue; // no pivot in this column
		}
		this.scaleRow(topRow, 1/this.getCell(topRow, pivot));
		for (let row = 0; row < this.rows; row++) {
			if (row === topRow) {
				continue;
			}
			this.addMultipleOfRowToRow(topRow, -this.getCell(row, pivot), row);
		}
		topRow++;
	}
	return this;
};

module.exports = Matrix;