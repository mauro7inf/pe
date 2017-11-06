let X = +(process.argv[2]);
let Y = +(process.argv[3]);

function size(x, y) { // position
    return (Math.sqrt((x - y)*(x - y) + 4) - (x + y))/2;
}

function isDone() {
    for (let i = 0; i < regions.length; i++) {
        if (regions[i].index.x <= X && regions[i].index.y <= Y) {
            return false;
        }
    }
    return true;
}

let setupRegions = [
    {
        position: {
            x: 1,
            y: 0
        },
        index: {
            x: 0,
            y: 0
        },
        size: size(1, 0)
    }
];

let smallestSize = size(1, 0);
while (setupRegions.length > 0) {
    let r = setupRegions.shift();
    console.log('(' + r.index.x + ', ' + r.index.y + '), ' + r.size);
    if (r.size < smallestSize) {
        smallestSize = r.size;
    }
    let xr = {
        position: {
            x: r.position.x + r.size,
            y: r.position.y
        },
        index: {
            x: r.index.x + 1,
            y: r.index.y
        },
        size: size(r.position.x + r.size, r.position.y)
    };
    let yr = {
        position: {
            x: r.position.x,
            y: r.position.y + r.size
        },
        index: {
            x: r.index.x,
            y: r.index.y + 1
        },
        size: size(r.position.x, r.position.y + r.size)
    };
    if (xr.index.x <= X && xr.index.y <= Y) {
        setupRegions.push(xr);
    }
    if (yr.index.x <= X && yr.index.y <= Y) {
        setupRegions.push(yr);
    }
}

let current = 0;
let regions = [
    {
        position: {
            x: 1,
            y: 0
        },
        index: {
            x: 0,
            y: 0
        },
        size: size(1, 0)
    }
];

count = 0;
while (!isDone()) {
    let r = regions.shift();
    current++;
    //console.log(current + ': (' + r.index.x + ', ' + r.index.y + '), ' + r.size);
    if ((r.index.x <= X && r.index.y <= Y) || r.index.y > 0) {
        console.log(current + ': (' + r.index.x + ', ' + r.index.y + ')');
        if (r.index.x === X && r.index.y === Y) {
            count++;
            console.log('            ' + count);
        }
    }
    let xr = {
        position: {
            x: r.position.x + r.size,
            y: r.position.y
        },
        index: {
            x: r.index.x + 1,
            y: r.index.y
        },
        size: size(r.position.x + r.size, r.position.y)
    };
    let yr = {
        position: {
            x: r.position.x,
            y: r.position.y + r.size
        },
        index: {
            x: r.index.x,
            y: r.index.y + 1
        },
        size: size(r.position.x, r.position.y + r.size)
    };
    let smaller = yr;
    let larger = xr;
    if (xr.size < yr.size) {
        smaller = xr;
        larger = yr;
    }
    let toAdd = [larger, smaller].filter((e) => {
        return e.size >= smallestSize;
    });
    if (regions.length > 0 && toAdd.length > 0 && regions[0].size < toAdd[0].size) {
        regions.unshift(toAdd.shift());
    }
    for (let i = 0; i < regions.length - 1 && toAdd.length > 0; i++) {
        if (regions[i].size > toAdd[0].size && regions[i + 1].size <= toAdd[0].size) {
            regions.splice(i + 1, 0, toAdd.shift());
        }
    }
    while (toAdd.length > 0) {
        regions.push(toAdd.shift());
    }
}

console.log(current);
