let primes = [];
let primeLimit = 1;
let primeLimitMultiplier = 2;

// returns a list of primes up to n
function getPrimesUpTo(n) {
  console.log('generating primes up to ' + n);
  // naive way
  primes = [];
  let sieve = [];
  for (let i = 0; i <= n; i++) {
    sieve[i] = false;
  }
  for (let currentPrime = 2; currentPrime <= n; currentPrime++) {
    if (sieve[currentPrime]) {
      continue;
    }
    primes.push(currentPrime);
    for (let j = currentPrime*currentPrime; j <= n; j += currentPrime) {
      sieve[j] = true;
    }
  }
  primeLimit = n;
  return primes;
}

// returns the nth prime, where prime 1 is 2
function nthPrime(n) {
  while (primes.length < n) {
    getPrimesUpTo(primeLimit*primeLimitMultiplier);
  }
  return primes[n - 1];
}

// object where the keys are primes and the values are exponents
function factor(a) {
  let n;
  if (typeof a === 'object') {
    return a;
  } else {
    n = +a;
  }
  let factors = {};
  let currentPrimeIndex = 1;
  let r = n; // reduced n
  let currentPrime = nthPrime(currentPrimeIndex);
  while (currentPrime*currentPrime <= r) {
    if (r % currentPrime === 0) {
      if (currentPrime in factors) {
        factors[currentPrime]++;
      } else {
        factors[currentPrime] = 1;
      }
      r /= currentPrime;
    } else {
      currentPrimeIndex++;
      currentPrime = nthPrime(currentPrimeIndex);
    }
  }
  if (r > 1) {
    if (r in factors) {
      factors[r]++;
    } else {
      factors[r] = 1;
    }
  }
  return factors;
}

// factor a product of array of numbers
function factorProduct(a) {
  let factors = factor(a[0]);
  for (let i = 1; i < a.length; i++) {
    let newFactors = factor(a[i]);
    let pFactors = primeFactors(newFactors);
    for (let j = 0; j < pFactors.length; j++) {
      if (pFactors[j] in factors) {
        factors[pFactors[j]] += newFactors[pFactors[j]];
      } else {
        factors[pFactors[j]] = newFactors[pFactors[j]];
      }
    }
  }
  return factors;
}

// array of prime factors
// a can be either a number or an object of factors
function primeFactors(a) {
  let factors = null;
  if (typeof a === 'number' || typeof a === 'string') {
    factors = factor(+a);
  } else if (typeof a === 'object') {
    factors = a;
  }
  return Object.keys(factors).map(n => +n);
}

// array of arrays with factor pairs; accepts a factored number or a number
function factorPairs(a) {
  let factors = null;
  if (typeof a === 'number' || typeof a === 'string') {
    factors = factor(+a);
    n = +a;
  } else if (typeof a === 'object') {
    factors = a;
    n = multiplyFactors(a);
  }
  let pFactors = primeFactors(factors);
  let pairs = [];
  let nPrimes = pFactors.length;
  let currentFactor = [];
  for (let i = 0; i < nPrimes; i++) {
    currentFactor[i] = 0;
  }

  function computeCurrentFactor() {
    let f = 1;
    for (let i = 0; i < nPrimes; i++) {
      let p = pFactors[i];
      for (let j = 0; j < currentFactor[i]; j++) {
        f = f*p;
      }
    }
    return f;
  }

  function incrementCurrentFactor() {
    let c = 0;
    while (c < nPrimes) {
      currentFactor[c]++;
      let f = computeCurrentFactor();
      if (currentFactor[c] > factors[pFactors[c]] || f > n/f) {
        currentFactor[c] = 0;
        c++;
      } else {
        return;
      }
    }
    currentFactor = null;
  }

  while (currentFactor) {
    let f = computeCurrentFactor();
    pairs.push([f, n/f]);
    incrementCurrentFactor();
  }

  return pairs;
}

// multiply factors back together
function multiplyFactors(a) {
  let pFactors = primeFactors(a);
  let total = 1;
  for (let i = 0; i < pFactors.length; i++) {
    for (let j = 0; j < a[pFactors[i]]; j++) {
      total *= pFactors[i];
    }
  }
  return total;
}

// boolean if a (number or factored number) can be written
// as sum of two positive squares
function canBeSumOfTwoSquares(a) {
  let factors = factor(a);
  let pFactors = primeFactors(factors);
  let oddTwos = false;
  let pythagoreanPrimes = false;
  for (let i = 0; i < pFactors.length; i++) {
    let pType = pFactors[i] % 4;
    if (pType === 3 && factors[pFactors[i]] % 2 === 1) {
      return false;
    } else if (pType === 2 && factors[pFactors[i]] % 2 === 1) {
      oddTwos = true;
    } else if (pType === 1) {
      pythagoreanPrimes = true;
    }
  }
  return oddTwos || pythagoreanPrimes;
}

module.exports = {
  getPrimesUpTo: getPrimesUpTo,
  nthPrime: nthPrime,
  factor: factor,
  factorProduct: factorProduct,
  primeFactors: primeFactors,
  factorPairs: factorPairs,
  canBeSumOfTwoSquares: canBeSumOfTwoSquares
};
