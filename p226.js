let N = process.argv[2]; // max precision

let debugOn = false; // set to true to enable debug

function debug(s) {
  if (!debugOn) {
    return;
  }
  console.log(s);
}

function frac(x) {
	return x - Math.floor(x);
}

// formula for lower semicircle:
// (x - 1/4)^2 + (y - 1/2)^2 = (1/4)^2
// y = 1/2 - sqrt((1/4)^2 - (x - 1/4)^2)
function circle(x) {
	return 0.5 - Math.sqrt(0.0625 - (x - 0.25)*(x - 0.25));
}

function blancmange(x) {
	let xr = x; // reduced
	let total = 0;
	for (let i = 0; i < N; i++) {
		if (xr === 0) {
			break;
		}
		if (xr < 0.5) {
			total += xr/Math.pow(2, i);
		} else {
			total += (1 - xr)/Math.pow(2, i);
		}
		xr = 2*xr - Math.floor(2*xr);
	}
	return total;
}

function intersect() {
	let x0 = 0;
	let x1 = 0.25;
	for (let i = 0; i < N; i++) { // use N steps for convenience, I guess
		let x = (x0 + x1)/2;
		let b = blancmange(x);
		let c = circle(x);
		if (b < c) {
			x0 = x;
		} else if (b > c) {
			x1 = x;
		} else {
			return x; // unlikely
		}
	}
	return (x0 + x1)/2;
}

// indefinite integral ∫sqrt(r^2 – x^2)dx, no constant
function integrateRadical(r, x) {
	let xr = Math.sqrt(r*r - x*x);
	return (1/2)*(x*xr + r*r*Math.atan(x/xr));
}

// area under circle from a to b
function integrateCircle(a, b) {
	let h = 1/4;
	let k = 1/2;
	let r = 1/4;
	return k*(b - a) + integrateRadical(r, a - h) - integrateRadical(r, b - h);
}

function integrateBlancmange(a, b) {
	let total = 0;
	for (let i = 0; i < N; i++) {
		pow2 = Math.pow(2, i);

		let as = a*pow2;
		let fas = frac(as);
		let an; // integer nearest as
		let adir; // direction of said integer from as, -1 for down and 1 for up
		if (fas < 0.5) {
			an = Math.floor(as);
			adir = -1;
		} else {
			an = Math.ceil(as);
			adir = 1;
		}

		let bs = b*pow2;
		let fbs = frac(bs);
		let bn;
		let bdir;
		if (fbs < 0.5) {
			bn = Math.floor(bs);
			bdir = -1;
		} else {
			bn = Math.ceil(bs);
			bdir = 1;
		}

		let triangleArea = 1/4; // in units of 1/(pow2*pow2)
		let fullTriangles = (bn - an)*triangleArea;
		let aPartialTriangle;
		let bPartialTriangle;
		if (adir === -1) {
			aPartialTriangle = -fas*fas/2;
		} else {
			aPartialTriangle = (1 - fas)*(1 - fas)/2;
		}
		if (bdir === 1) {
			bPartialTriangle = -(1 - fbs)*(1 - fbs)/2;
		} else {
			bPartialTriangle = fbs*fbs/2;
		}

		let iterationArea = (fullTriangles + aPartialTriangle + bPartialTriangle)/(pow2*pow2);
		total += iterationArea;
	}
	return total;
}

let c = intersect();

console.log(integrateBlancmange(c, 1/2) - integrateCircle(c, 1/2));