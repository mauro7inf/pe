let N = +(process.argv[2]);

let points = [];
let triangles = [];
let triangleIndexMap = {};
let polygons = [[]];
let maxArea = 0

function generatePoints() {
	console.log('Generating points...');
	let s = 290797;
	for (let i = 0; i < N; i++) {
		let point = {
			index: i
		};
		s = (s * s) % 50515093;
		point.x = (s % 2000) - 1000;
		s = (s * s) % 50515093;
		point.y = (s % 2000) - 1000;
		points.push(point);
	}
}

function pointToString(point) {
	return '(' + point.x + ', ' + point.y + ')';
}

function triangleArea(triangle) {
	let v12 = {
		x: triangle[1].x - triangle[0].x,
		y: triangle[1].y - triangle[0].y
	};
	let v13 = {
		x: triangle[2].x - triangle[0].x,
		y: triangle[2].y - triangle[0].y
	};
	return (v12.x*v13.y - v12.y*v13.x)/2;
}

function triangleSign(p1, p2, p3) {
	let k = triangleArea([p1, p2, p3]);
	if (k > 0) {
		return 1;
	} else if (k < 0) {
		return -1;
	} else {
		return 0;
	}
}

function buildTriangle(p1, p2, p3) {
	if (triangleSign(p1, p2, p3) >= 0) {
		return [p1, p2, p3];
	} else {
		return [p1, p3, p2];
	}
}

function pointInConvexPolygon(point, polygon) {
	let sign = triangleSign(point, polygon[0], polygon[1]);
	let n = polygon.length;
	for (let i = 1; i < n; i++) {
		let sideSign = triangleSign(point, polygon[i], polygon[(i + 1) % n]);
		if (sideSign !== sign || sideSign === 0) {
			return false;
		}
	}
	return true;
}

function generateTriangles() {
	console.log('Generating triangles...');
	triangles.push(buildTriangle(points[0], points[1], points[2]));
	for (let i = 3; i < N; i++) {
		console.log('N = ' + i);
		let point = points[i];
		for (let j = 0; j < triangles.length; j++) {
			if (pointInConvexPolygon(point, triangles[j])) {
				triangles.splice(j, 1);
				j--;
			}
		}
		for (let u = 0; u < i - 1; u++) {
			for (let v = u + 1; v < i; v++) {
				let triangle = buildTriangle(points[u], points[v], points[i]);
				let triangleIsSafe = true;
				for (let w = 0; w < i; w++) {
					if (w === u || w === v) {
						continue;
					}
					if (pointInConvexPolygon(points[w], triangle)) {
						triangleIsSafe = false;
						break;
					}
				}
				if (triangleIsSafe) {
					triangles.push(triangle);
				}
			}
		}
	}
}

function mapTrianglePermutation(a, b, c, t) {
	if (!(a in triangleIndexMap)) {
		triangleIndexMap[a] = {};
	}
	if (!(b in triangleIndexMap[a])) {
		triangleIndexMap[a][b] = {};
	}
	triangleIndexMap[a][b][c] = t;
}

function mapTriangle(a, b, c, t) {
	mapTrianglePermutation(a, b, c, t);
	mapTrianglePermutation(a, c, b, t);
	mapTrianglePermutation(b, a, c, t);
	mapTrianglePermutation(b, c, a, t);
	mapTrianglePermutation(c, a, b, t);
	mapTrianglePermutation(c, b, a, t);
}

function generateTriangleIndexMap() {
	console.log('Generating triangle index map...');
	for (let i = 0; i < triangles.length; i++) {
		let a = triangles[i][0].index;
		let b = triangles[i][1].index;
		let c = triangles[i][2].index;
		mapTriangle(a, b, c, i);
	}
}

function isValidTriangle(a, b, c) {
	return (a in triangleIndexMap && b in triangleIndexMap[a] && c in triangleIndexMap[a][b]);
}

function addPoint(polygon, point) {
	if (polygon.length > 1) {
		for (let i = 0; i < polygon.length - 1; i++) {
			for (let j = i + 1; j < polygon.length; j++) {
				if (!isValidTriangle(polygon[i], polygon[j], point)) {
					return null;
				}
			}
		}
	}
	let newPolygon = polygon.slice();
	if (polygon.length <= 1) {
		newPolygon.push(point);
	} else {
		for (let i = 0; i < polygon.length; i++) {
			if (triangleSign(points[polygon[i]], points[point], points[polygon[(i + 1) % polygon.length]]) > 0) {
				newPolygon.splice(i + 1, 0, point);
				break;
			}
		}
	}
	return newPolygon;
}

function polygonArea(polygon) {
	if (polygon.length < 3) {
		return 0;
	}
	let total = 0;
	for (let i = 0; i < polygon.length; i++) {
		let p1 = points[polygon[i]];
		let p2 = points[polygon[(i + 1) % polygon.length]];
		total += (p1.x*p2.y - p1.y*p2.x)/2;
	}
	return Math.abs(total);
}

function generatePolygons() {
	console.log('Generating polygons...');
	for (let i = 0; i < N; i++) {
		console.log('N = ' + i);
		let currentPolygons = polygons.length;
		for (let j = 0; j < currentPolygons; j++) {
			let newPolygon = addPoint(polygons[j], i);
			if (newPolygon !== null) {
				polygons.push(newPolygon);
				let a = polygonArea(newPolygon);
				if (a > maxArea) {
					maxArea = a;
				}
			}
		}
	}
}

generatePoints();
generateTriangles();
generateTriangleIndexMap();
generatePolygons();
console.log('DONE!');
console.log(maxArea);