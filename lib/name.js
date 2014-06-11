var fs = require('fs');

module.exports = name;
// Okay, phew, let's uh pick a random name
var names = JSON.parse(fs.readFileSync('./lib/gismu.json', 'utf8'));

// Stolen (borrowed) off the internet.
function shuffle(a,b) {
    // Distribution of numbers is -1, 0, 0, 1
    var nonzero = Math.random() < 0.5 ? 1 : 0;
    var sign = Math.random() < 0.5 ? 1 : -1;
    return (nonzero * sign);
}

names.sort(shuffle);

function name() {
    return names.pop();
}
