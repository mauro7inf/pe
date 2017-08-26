let N = process.argv[2];

let debugOn = false; // set to true to enable debug

function debug(s) {
  if (!debugOn) {
    return;
  }
  console.log(s);
}

let count = 0;
for (let o = 1; count < N; o += 2) {
	let t = [1, 1, 1];
	while (true) { // we'll break out when necessary
		if (t[2] % o === 0) {
			break;
		}
		t.push((t[0] + t[1] + t[2]) % o);
		t.shift();
		if (t[0] === 1 && t[1] === 1 && t[2] === 1) {
			count++;
			console.log(count + ': ' + o);
			break;
		}
	}
}