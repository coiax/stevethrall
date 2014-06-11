var fs = require('fs');

var mineflayer = require('mineflayer');
var navigatePlugin = require('mineflayer-navigate')(mineflayer);


var my_name = names[0];

var bot = mineflayer.createBot({
    username: my_name,
    host: '192.9.206.136',
});

// Inject navigation plugin
navigatePlugin(bot);

function von_neumann(point) {
    var points = [];

    points.push(point.clone().translate(1,0,0));
    points.push(point.clone().translate(-1,0,0));
    points.push(point.clone().translate(0,1,0));
    points.push(point.clone().translate(0,-1,0));
    points.push(point.clone().translate(0,0,1));
    points.push(point.clone().translate(0,0,-1));

    return points;
}

function moore(point) {
    var points = [];

    for (var i=-1; i <= 1; i++) {
        for (var j=-1; j <= 1; j++) {
            for (var k=-1; k <= 1; k++) {
                var other = point.clone().translate(i,j,k);
                if (other != point) {
                    points.push(other);
                }
            }
        }
    }
    // End massive for loop.

    return points;
}

function tree_search(logs) {
    // Given an Array of blocks (which have .position properties), return a
    // list of "trees", where a tree is a horizontally and/or diagonally
    // contigious set of log blocks. A tree cannot be a subset of another
    // tree, that's just one big tree.
    console.log("Searching for trees.");
    var trees = [];
    logs.forEach(function(block, index, arr) {
        already_in = false;
        for (var i=0;i < trees.length; i++) {
            if (trees[i].indexOf(block) != -1) {
                already_in = true;
                break;
            }
        }
        if (!already_in) {
            var done = [];

            var todo = [];
            todo.push(block);

            while (todo.length != 0) {
                var target_block = todo.pop();

                var neighbours = moore(target_block.position);
                neighbours.forEach(function(point, index, arr) {
                    var block = bot.blockAt(point);
                    if (block != null && block.type == 17) {
                        todo.push(block);
                    }
                });

                done.push(target_block);
            }

            trees.push(done);
        }
    });
    console.log("DONE");
}

bot.on("spawn", function() {
    bot.chat("Hello world!");
    // Search for log blocks in a 16x16x16 box.
    var logs = [];

    for (var i=-8; i <= 8; i++) {
        for (var j=-8; j <= 8; j++) {
            for (var k=-8; k <= 8; k++) {
                var pos = bot.entity.position.clone();
                pos.translate(i,j,k).floor();

                var block = bot.blockAt(pos);
                if (block != null && block.type == 17) {
                    logs.push(block);
                }
    }}}

    tree_search(logs);
});

bot.on("entityMoved", function(entity) {
    if (entity != bot.entity && entity.type == "player") {

        var pos = entity.position.clone();
        // Look at the player's head, not their feet.
        pos.translate(0, 1.62, 0);

        bot.lookAt(pos);
    }
});
