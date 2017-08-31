let NumberTheory = require('./NumberTheory');
let LargeInteger = require('./LargeInteger');

let N = process.argv[2]; // highest N for circle passing through (0, 0), (0, N), etc.
let L = process.argv[3]; // number of lattice points required; must be 4 times an odd number

let debugOn = false; // set to true to enable debug

function debug(s) {
  if (!debugOn) {
    return;
  }
  console.log(s);
}

let pythagoreanPrimes = [];
let lastPrimeChecked = 0;

function noPythagoreans(n) {
  let pFactors = NumberTheory.primeFactors(n);
  for (let i = 0; i < pFactors.length; i++) {
    if (pFactors[i] % 4 === 1) {
      return false;
    }
  }
  return true;
}

// prime 1 is 5, prime 2 is 13, etc.
function nthPythagoreanPrime(n) {
  while (pythagoreanPrimes.length < n) {
    lastPrimeChecked++;
    let nextPrime = NumberTheory.nthPrime(lastPrimeChecked);
    if (nextPrime % 4 === 1) {
      pythagoreanPrimes.push(nextPrime);
    }
  }
  return pythagoreanPrimes[n - 1];
}

function realize(set, items) {
  let total = 1;
  for (let i = 0; i < set.length; i++) {
    total *= Math.pow(nthPythagoreanPrime(items[i]), set[i]);
  }
  return total;
}

// first split up L/4 into factor sets
// then find Pythagorean primes with corresponding exponents
// then multiply by numbers with no Pythagorean prime factors

let sum = new LargeInteger(0);
let sets = NumberTheory.factorSets(L/4);

for (let i = 0; i < sets.length; i++) {
  let rawSet = sets[i];
  let set = []
  for (let j = rawSet.length - 1; j >= 0; j--) {
    set.push((rawSet[j] - 1)/2);
  }
  console.log(set);

  let items = [];
  for (let j = 1; j <= set.length; j++) {
    items.push(j); // initialize items to smallest
  }
  let realized = realize(set, items);
  console.log(realized);

  let done = false;
  if (realized > N) {
    done = true;
  }
  while (!done) {
    // add the current realization
    for (let j = 1; realized*j <= N; j++) {
      if (noPythagoreans(j)) {
        sum = sum.add(realized*j);
      }
    }
    // increment the realization
    let c = set.length - 1;
    while (c >= 0) {
      items[c]++;
      console.log(items);
      let found = false;
      for (let e = 0; e < c; e++) {
        if (items[e] === items[c]) {
          found = true;
        }
      }
      while (found) {
        items[c]++;
        console.log(items);
        found = false;
        for (let e = 0; e < c; e++) {
          if (items[e] === items[c]) {
            found = true;
          }
        }
      }
      for (let d = c + 1; d < set.length; d++) {
        items[d] = 1;
        console.log(items);
        let found = false;
        for (let e = 0; e < d; e++) {
          if (items[e] === items[d]) {
            found = true;
          }
        }
        while (found) {
          items[d]++;
          console.log(items);
          found = false;
          for (let e = 0; e < d; e++) {
            if (items[e] === items[d]) {
              found = true;
            }
          }
        }
      }
      if (realize(set, items) > N) {
        c--;
      } else {
        break;
      }
    }
    if (c < 0) {
      done = true;
    } else {
      realized = realize(set, items);
      console.log(realized);
    }
  }
}

console.log(sum.toString());
