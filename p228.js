let NumberTheory = require('./NumberTheory');

let A = process.argv[2]; // first polygon
let B = process.argv[3]; // last polygon

let debugOn = false; // set to true to enable debug

function debug(s) {
  if (!debugOn) {
    return;
  }
  console.log(s);
}

function generatePolygon(n) {
  let o = [[0, 1]]; // list of orientations of sides
  for (let i = 1; i < n; i++) {
    let d = NumberTheory.gcd(i, n);
    o.push([i/d, n/d]);
  }
  return o;
}

function mergeFractionLists(o1, o2) {
  let o = [];
  let i1 = 0;
  let i2 = 0;
  while (i1 < o1.length && i2 < o2.length) {
    if (o1[i1][0]*o2[i2][1] < o1[i1][1]*o2[i2][0]) {
      o.push(o1[i1]);
      i1++;
    } else if (o1[i1][0]*o2[i2][1] > o1[i1][1]*o2[i2][0]) {
      o.push(o2[i2]);
      i2++;
    } else { // if they're the same, don't repeat
      o.push(o1[i1]);
      i1++
      i2++;
    }
  }
  while (i1 < o1.length) { // should only be one of these
    o.push(o1[i1]);
    i1++;
  }
  while (i2 < o2.length) {
    o.push(o2[i2]);
    i2++;
  }
  return o;
}

let list = [];
for (let i = A; i <= B; i++) {
  list.push(generatePolygon(i));
}
while (list.length > 1) {
  let newList = [];
  for (let i = 0; i < list.length; i += 2) {
    if (i + 1 === list.length) {
      newList.push(list[i]);
    } else {
      newList.push(mergeFractionLists(list[i], list[i + 1]));
    }
  }
  list = newList;
}

console.log(list[0].length);
