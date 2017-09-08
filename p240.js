let Combinatorics = require('./Combinatorics');
let LargeInteger = require('./LargeInteger');

let DICE = +process.argv[2];
let SIDES = +process.argv[3];
let TOP = +process.argv[4];
let SUM = +process.argv[5];

function T(dice, top, sum, soFar) {
  console.log('[' + soFar.join(', ') + ']');
  let highest;
  if (top === 0) {
    if (sum > 0) {
      return new LargeInteger(0);
    }
    if (soFar.length > 0) {
      highest = soFar[soFar.length - 1];
    } else {
      return (new LargeInteger(SIDES)).exponent(dice);
    }
    let total = new LargeInteger(0);
    for (let i = 0; i <= dice; i++) { // number of dice that repeat highest
      if (highest === 1) {
        i = dice; // skip to the last iteration in this case
      }
      let totalDice = dice + soFar.length;
      let freeDice = dice - i;
      let counts = [];
      for (let j = 0; j <= SIDES; j++) {
        counts[j] = 0;
      }
      for (let j = 0; j < soFar.length; j++) {
        counts[soFar[j]]++;
      }
      counts[soFar[soFar.length - 1]] += i;
      let numerator = Combinatorics.factorial(soFar.length + i);
      let denominator = new LargeInteger(1);
      for (let j = 0; j < counts.length; j++) {
        denominator = denominator.multiply(Combinatorics.factorial(counts[j]));
      }
      let permutations = numerator.quotient(denominator);
      let combinations = Combinatorics.nCr(totalDice, freeDice);
      let others = (new LargeInteger(highest - 1)).exponent(freeDice);
      let rolls = permutations.multiply(combinations).multiply(others);
      total =  total.add(rolls);
    }
    return total;
  } else if (sum <= 0) {
    return new LargeInteger(0);
  } else {
    highest = SIDES;
    if (soFar.length > 0) {
      highest = soFar[soFar.length - 1];
    }
    if (highest > sum + 1 - top) {
      highest = sum + 1 - top;
    }
    let lowest = 1;
    if (lowest < sum/top) {
      lowest = Math.ceil(sum/top);
    }
    let total = new LargeInteger(0);
    for (let i = highest; i >= lowest; i--) {
      total = total.add(T(dice - 1, top - 1, sum - i, soFar.concat(i)));
    }
    return total;
  }
}

console.log(T(DICE, TOP, SUM, []).toString());
