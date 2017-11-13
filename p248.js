let NumberTheory = require('./NumberTheory');

let N = +(process.argv[2]);
let K = +(process.argv[3]);

function inverseTotient(n) {
    return inverseTotientHelper(n, []);
}

function inverseTotientHelper(n, primesUsed) {
    //console.log(n + ': ' + primesUsed.join(', '));
    let factored = NumberTheory.factor(n);
    let pFactors = NumberTheory.primeFactors(factored);
    let factors = NumberTheory.factorPairs(factored);

    let multiplePrimes = [];

    let powerList = []; // array of pairs [p, r], where p is a prime factor
    // and r is the largest exponent of that prime that could be in the
    // inverse totient
    for (let i = 0; i < pFactors.length; i++) {
        let p = pFactors[i];
        if (primesUsed.indexOf(p) !== -1) {
            continue;
        }
        if (n % (p - 1) !== 0) {
            continue;
        }
        let nReduced = n/(p - 1);
        let r = 1;
        while (nReduced % p === 0) {
            r++;
            nReduced /= p;
        }
        powerList.push([p, r]);
        multiplePrimes.push(p);
    }

    for (let i = 0; i < factors.length; i++) {
        for (let j = 0; j < factors[i].length; j++) {
            let f = factors[i][j];
            if (NumberTheory.isPrime(f + 1) && multiplePrimes.indexOf(f + 1) === -1 && primesUsed.indexOf(f + 1) === -1) {
                powerList.push([f + 1, 1]);
            }
        }
    }

    let result = [];
    let used = primesUsed.slice();

    for (let i = 0; i < powerList.length; i++) {
        let p = powerList[i][0];
        used.push(p);
        let newUsed = used.slice();
        let rMax = powerList[i][1];
        for (let r = 1; r <= rMax; r++) {
            let pp = Math.pow(p, r);
            let pr = (pp/p)*(p - 1);
            let nReduced = n/pr;
            if (nReduced === 1) {
                result.push(pp);
                //console.log('\t' + p + '!!!!!!!!!!!!!');
            } else {
                let invTotients = inverseTotientHelper(nReduced, newUsed);
                for (let j = 0; j < invTotients.length; j++) {
                    result.push(invTotients[j]*pp);
                }
            }
        }
    }

    return result;
}

console.log(inverseTotient(N).sort((e1, e2) => {return e1 - e2;})[K - 1]);
