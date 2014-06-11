// Module imports

var fs = require('fs');

var mineflayer = require('mineflayer');
var navigatePlugin = require('mineflayer-navigate')(mineflayer);

var generate_name = require('./lib/name')
var name = generate_name();
var bot = mineflayer.createBot({
    username: name,
    host: '192.9.206.136',
});

navigatePlugin(bot);

function faraway() {
    var xrange = 500;
    var yrange = 64;
    var zrange = 500;

    var pos = bot.entity.position.offset(
            (Math.random() - 0.5) * xrange,
            (Math.random() - 0.5) * yrange,
            (Math.random() - 0.5) * zrange);
    return pos.floor();
}

function wander() {
    var sensible_goals = false;
    var count = 0;
    var timeout = 500;
    while (!sensible_goals) {
        var destination = faraway();
        count = count + 1;
        var answer = bot.navigate.findPathSync(destination,
                {'timeout': timeout});
        if (answer['status'] == 'success' || answer['status'] == 'tooFar') {
            sensible_goals = true;
        }
    }
    console.log("Tried " + count + " paths. Going to " + destination);
    bot.navigate.to(faraway(), {'timeout':timeout});
}

bot.on("spawn", function() {
    console.log(name + " spawned.");
    wander();
});

bot.navigate.on('cannotFind', function(path) {
    console.log("Cannot find path.");
    var nearest = path[path.length - 1];
    console.log("Nearest is: " + nearest);
    bot.navigate.to(nearest);
});

bot.navigate.on('arrived', function() {
    console.log("Arrived!");
    wander();
});

bot.navigate.on('interrupted', function() {
    console.log("Interrupted!");
    wander();
});
