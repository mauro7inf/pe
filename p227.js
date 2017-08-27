let Matrix = require('./Matrix');

let N = process.argv[2]; // max precision

let debugOn = false; // set to true to enable debug

function debug(s) {
  if (!debugOn) {
    return;
  }
  console.log(s);
}

let matrix = new Matrix(N/2, N/2 + 1);
matrix.setCell(17, 0, 0);
matrix.setCell(-8, 0, 1);
matrix.setCell(-1, 0, 2);
matrix.setCell(-8, 1, 0);
matrix.setCell(18, 1, 1);
matrix.setCell(-8, 1, 2);
matrix.setCell(-1, 1, 3);
matrix.setCell(-1, N/2 - 2, N/2 - 4);
matrix.setCell(-8, N/2 - 2, N/2 - 3);
matrix.setCell(17, N/2 - 2, N/2 - 2);
matrix.setCell(-8, N/2 - 2, N/2 - 1);
matrix.setCell(-2, N/2 - 1, N/2 - 3);
matrix.setCell(-16, N/2 - 1, N/2 - 2);
matrix.setCell(18, N/2 - 1, N/2 - 1);
for (let r = 0; r < N/2; r++) {
	matrix.setCell(36, r, N/2);
}
for (let r = 2; r <= N/2 - 3; r++) {
	matrix.setCell(-1, r, r - 2);
	matrix.setCell(-8, r, r - 1);
	matrix.setCell(18, r, r);
	matrix.setCell(-8, r, r + 1);
	matrix.setCell(-1, r, r + 2);
}
for (let r = 0; r < N/2; r++) {
	for (let c = 0; c < N/2; c++) {
		if (r - c !== 2 && r - c !== 1 && r - c !== 0 && r - c !== -1 && r - c !== -2) {
			matrix.setCell(0, r, c);
		}
	}
}

matrix.gaussJordan();

console.log(matrix.getCell(N/2 - 1, N/2));