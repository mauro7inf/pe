let pow2 = [];

let currPow = 1;
for (let i = 0; i < 32; i++) {
  pow2.push(currPow);
  currPow *= 2;
}

function BitArray() {
  this.bits = {};
}

BitArray.prototype.getBit = function (N) {
  let address = Math.floor(N/32);
  if (address in this.bits) {
    let reg = this.bits[address];
    return (reg & pow2[N % 32])/pow2[N % 32];
  }
};

BitArray.prototype.setBit = function (N) {
  let address = Math.floor(N/32);
  if (address in this.bits) {
    this.bits[address] |= pow2[N % 32];
  } else {
    this.bits[address] = pow2[N % 32];
  }
};

BitArray.prototype.unsetBit = function (N) {
  let address = Math.floor(N/32);
  if (address in this.bits) {
    this.bits[address] &= ~pow2[N % 32];
  }
};

BitArray.prototype.countBits = function () {
  let count = 0;
  let addresses = Object.keys(this.bits);
  for (let i = 0; i < addresses.length; i++) {
    let reg = this.bits[addresses[i]];
    for (let j = 0; j < 32; j++) {
      if (reg & pow2[j]) {
        count++;
      }
    }
  }
  return count;
}

module.exports = BitArray;
