let LargeInteger = require('./LargeInteger');
let LargeIntegerMatrix = require('./LargeIntegerMatrix');

let N = +(process.argv[2]);
let M = +(process.argv[3]);
let D = +(process.argv[4]);

let set = [];
for (let i = 1; i <= N; i++) {
    if (i % 1000 === 0) {
        console.log(i);
    }
    let r = new LargeInteger(i);
    let ex = r.exponentMod(i, M);
    set.push(ex.toString());
}

let counts = {};
for (let i = 0; i < set.length; i++) {
    let t = set[i];
    if (t in counts) {
        counts[t]++;
    } else {
        counts[t] = 1;
    }
}

let d = (new LargeInteger(10)).exponent(D);

let totals = new LargeIntegerMatrix(M, 1);
for (let i = 1; i < M; i++) {
    totals.setCell(0, i, 0);
}
let two = new LargeInteger(2);
totals.setCell(two.exponentMod(counts[0], d), 0, 0);

let residues = Object.keys(counts);
for (let i = 0; i < residues.length; i++) {
    let k = +residues[i];
    if (k === 0) {
        continue;
    }
    console.log(k);
    let v = counts[k];
    let matrix = new LargeIntegerMatrix.identity(M);
    for (let j = 0; j < M; j++) {
        matrix.setCell(1, j, (j + k) % M);
    }
    for (let u = 0; u < v; u++) {
        console.log('\t' + (u + 1) + '/' + v);
        totals = matrix.multiplyMod(totals, d);
    }
}

console.log(totals.getCell(0, 0).subtract(1).toString());
