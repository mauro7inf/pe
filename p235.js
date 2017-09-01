let N = process.argv[2];

let debugOn = false; // set to true to enable debug

function debug(s) {
  if (!debugOn) {
    return;
  }
  console.log(s);
}

let target = -600000000000;
let n = 5000;

function sum(r) {
	let rn = Math.pow(r, n);
	let r1 = r - 1;
	let firstTerm = 900*r1 - 3*n*r1 + 3;
	let secondTerm = -900*r1 - 3
	return (rn*firstTerm + secondTerm)/(r1*r1);
}

console.log(sum(1.1));

let x0 = 1.0000000001;
let x1 = 1.1;

for (let i = 0; i < N; i++) {
	let x = (x0 + x1)/2;
	let s = sum(x);
	console.log('s(' + x + ') = ' + s);
	if (s < target) {
		x1 = x;
	} else {
		x0 = x;
	}
}