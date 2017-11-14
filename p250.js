let LargeInteger = require('./LargeInteger');

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

let totals = new Array(M);
for (let i = 1; i < M; i++) {
    totals[i] = new LargeInteger(0);
}
let two = new LargeInteger(2);
totals[0] = two.exponentMod(counts[0], d);

let residues = Object.keys(counts);
for (let i = 0; i < residues.length; i++) {
    let k = +residues[i];
    if (k === 0) {
        continue;
    }
    console.log(k);
    let v = counts[k];
    for (let u = 0; u < v; u++) {
        let newTotals = new Array(M);
        for (let w = 0; w < M; w++) {
            newTotals[(w + k) % M] = totals[w].add(totals[(w + k) % M]).mod(d);
        }
        totals = newTotals;
    }
}

console.log(totals[0].subtract(1).toString());
