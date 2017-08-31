let N = process.argv[2];

let debugOn = false; // set to true to enable debug

function debug(s) {
  if (!debugOn) {
    return;
  }
  console.log(s);
}

// set up memoization arrays

let k = [];
let p = [];

for (let i = 0; i <= N; i++) {
  k[i] = [];
  p[i] = [];
  for (let j = 0; j <= N; j++) {
    k[i][j] = null;
    p[i][j] = null;
  }
}

// populate memoization arrays

for (let i = 0; i <= N; i++) {
  k[i][0] = 1;
  p[0][i] = 0;
}

function K(a, b) {
  if (b < 0) {
    return K(a, 0);
  }
  if (k[a][b] === null) {
    k[a][b] = (1/2)*P(a, b) + (1/2)*P(a - 1, b);
  }
  debug('K(' + a + ', ' + b + ') = ' + k[a][b]);
  return k[a][b];
}

function P(a, b) {
  if (p[a][b] === null) {
    let values = [];
    for (let t = 1; Math.pow(2, t - 2) < b; t++) {
      let twoT = Math.pow(2, t);
      values.push(((twoT - 1)/(twoT + 1))*P(a - 1, b) + (2/(twoT + 1))*K(a, b - twoT/2));
    }
    debug(values);
    p[a][b] = Math.max.apply(null, values);
  }
  debug('P(' + a + ', ' + b + ') = ' + p[a][b]);
  return p[a][b];
}

for (let i = 1; i <= N; i++) {
  for (let j = 1; j <= i; j++) {
    P(i, j);
    K(i, j);
  }
}

debug(p);
debug(k);

console.log(K(N, N));
