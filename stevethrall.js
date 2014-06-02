var fs = require('fs');

var mineflayer = require('mineflayer');

// Okay, phew, let's uh pick a random name
var names = JSON.parse(fs.readFileSync('gismu.json', 'utf8'));

// Stolen (borrowed) off the internet.
function shuffle(a,b) {
    // Get a random number between 0 and 10
    var temp = parseInt( Math.random()*10 );

    // Get 1 or 0, whether temp is odd or even
    var isOddOrEven = temp%2;

    // Get +1 or -1, whether temp greater or smaller than 5
    var isPosOrNeg = temp>5 ? 1 : -1;

    // Return -1, 0, or +1
    return( isOddOrEven*isPosOrNeg );
}

names.sort(shuffle);
var my_name = names[0];

var bot = mineflayer.createBot({
    username: my_name,
    host: '192.9.206.136',
});

bot.on("spawn", function() {
    bot.chat("Hello world!");
    // Search for a tree in a 16x16x16 box.
    for (var i=-8; i < 8; i++) {
        for (var j=-8; j < 8; j++) {
            for (var k=-8; k < 8; k++) {
                var pos = bot.entity.position.clone();
                pos.translate(i,j,k).floor();

                var block = bot.blockAt(pos);
                if (block != null && block.type == 17) {
                    console.log("Log at " + pos.toString());
                }
    }}}
});

bot.on("entityMoved", function(entity) {
    if (entity != bot.entity && entity.type == "player") {

        var pos = entity.position.clone();
        // Look at the player's head, not their feet.
        pos.translate(0, 1.62, 0);

        bot.lookAt(pos);
    }
});
