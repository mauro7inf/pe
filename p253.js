//let LargeInteger = require('./LargeInteger');
//let Combinatorics = require('./Combinatorics');

let N = +(process.argv[2]);

let start = '' + N;

let totals = [];
for (let i = 0; i <= Math.ceil(N/2); i++) {
  totals[i] = 0;//new LargeInteger(0);
}

let factorials = [1];//[new LargeInteger(1)];
for (let i = 1; i <= N; i++) {
  factorials[i] = factorials[i - 1]*i;//.multiply(i);
}

// pieces: a-b-c-d-...-z, where the variables indicate pieces yet to be picked up
// first and last can be 0
function iterate(pieces) {
  let piecesArray = pieces.split('-');
  let nextIteration = [];
  for (let i = 0; i < piecesArray.length; i++) {
    let leftSide = piecesArray.slice(0, i).join('-') + (i === 0 ? '' : '-');
    let rightSide = (i === piecesArray.length - 1 ? '' : '-') + piecesArray.slice(i + 1).join('-');
    for (let j = 1; j <= piecesArray[i]; j++) {
      let piece1 = j - 1;
      let piece2 = piecesArray[i] - j;
      let next = '';
      if ((piece1 > 0 && piece2 > 0) || (piece1 === 0 && piece2 > 0 && i === 0) || (piece1 > 0 && piece2 === 0 && i === piecesArray.length - 1)) {
        next = leftSide + [piece1, piece2].join('-') + rightSide;
      } else if (piece1 === 0 && (piece2 > 0 || i === piecesArray.length - 1)) {
        next = leftSide + '' + piece2 + rightSide;
      } else if (piece2 === 0 && (piece1 > 0 || i === 0)) {
        next = leftSide + '' + piece1 + rightSide;
      } else {
        next = leftSide + rightSide.substring(1);
      }
      let nextArray = next.split('-');
      if (nextArray.length > 1) {
        let ends = [nextArray[0], nextArray[nextArray.length - 1]].sort();
        let middle = nextArray.slice(1, -1).sort();
        next = ends[0] + '-' + middle.join('-') + (middle.length > 0 ? '-' : '') + ends[1];
      }
      nextIteration.push(next);
    }
  }
  return nextIteration;
}

function info(pieces) {
  let piecesArray = pieces.split('-');

  let piecesLeft = 0;
  let numberOfChunks = piecesArray.length - 1;
  let currentChunks = numberOfChunks;

  for (let i = 0; i < piecesArray.length; i++) {
    piecesLeft += +piecesArray[i];

    if (piecesArray.length === 1) {
      currentChunks += Math.ceil(piecesArray[i]/2);
    } else if (i === 0 || i === piecesArray.length - 1) {
      currentChunks += Math.ceil((piecesArray[i] - 1)/2);
    } else {
      currentChunks += Math.ceil((piecesArray[i] - 2)/2);
    }
  }

  return {
    piecesLeft: piecesLeft, // number of pieces left to collect
    numberOfChunks: numberOfChunks, // current number of chunks
    maxChunks: currentChunks // max possible number of chunks
  };
}

let oldGeneration = {};
oldGeneration[start] = {
  M: {0: 1/*new LargeInteger(1)*/},
  info: info(start)
};
let newGeneration = {};
let generationNumber = 0;

while (Object.keys(oldGeneration).length > 0) {
  //console.dir(oldGeneration, {depth: null});
  let setsOfPieces = Object.keys(oldGeneration);
  console.log('Generation ' + ++generationNumber + ': ' + setsOfPieces.length + ' sets of pieces');

  for (let i = 0; i < setsOfPieces.length; i++) {
    let pieces = setsOfPieces[i];
    let oldData = oldGeneration[pieces]; // contains an M and an info
    if (Object.keys(oldData.M).length === 0) {
      continue;
    }

    let descendants = iterate(pieces);

    for (let j = 0; j < descendants.length; j++) {
      let descendant = descendants[j];
      if (!(descendant in newGeneration)) {
        newGeneration[descendant] = {
          M: {},
          info: info(descendant)
        };
      }
      let newData = newGeneration[descendant];
      let newInfo = newData.info;
      
      for (let m in oldData.M) {
        let newM = m;
        if (m < newInfo.numberOfChunks) {
          newM = newInfo.numberOfChunks;
        }
        if (newM >= newInfo.maxChunks) {
          //totals[newM] = totals[newM].add(oldData.M[m].multiply(factorials[newInfo.piecesLeft]));
          totals[newM] += oldData.M[m]*factorials[newInfo.piecesLeft];
        } else {
          if (!(newM in newData.M)) {
            newData.M[newM] = 0;//new LargeInteger(0);
          }
          //newData.M[newM] = newData.M[newM].add(oldData.M[m]);
          newData.M[newM] += oldData.M[m];
        }
      }
    }
  }
  oldGeneration = newGeneration;
  newGeneration = {};
}

for (let i = 1; i < totals.length; i++) {
  console.log(i + ': ' + totals[i]/*.toString()*/);
}

let average = 0;//new LargeInteger(0);
for (let i = 1; i < totals.length; i++) {
  //average = average.add(totals[i].multiply(i));
  average += totals[i]*i;
}
//average = average.multiplyByPowerOf10(7);
//average = average.divide(factorials[N]).quotient;
average /= factorials[N];

//let numberAverage = +(average.toString())/10000000;

console.log('\nAverage: ' + average);