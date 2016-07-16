/*
* Generate a random integer
* min: Minimum integer
* max: Maximum integer
*/
function genRand(min, max) {
    return Math.floor((Math.random() * (max + 1)) + min);
}

/* 0: Correct, 1: Incorrect, 2: Pass */
var score = [0, 0, 0];
/* Choice button IDs */
var choiceIds = ["#b1", "#b2", "#b3"];
/* Generated integers for shoe ID */
var generated = new Array(3);
/* Names of the shoe choices */
var choiceNames = new Array(generated.length);
/* The correct answer index for generated */
var correctGenerated;
/* The correct answer image URL */
var correctImg = "images/icon.png";

/*
* Create HTML right/wrong alert.
* correctname - Name of the correct shoe
* correct - True if user chose correctly, false otherwise
* return: string of HTML
*/
function createBanner(correctname, correct) {
    var beginning = "<div class='alert alert-";
    var close = "</div>"
    if (correct) {
        return beginning + "success' style='text-align:center;'><strong>Correct!</strong>" + close;
    } else {
        return beginning + "danger'><strong>Wrong!</strong> The shoe was " + correctname + close;
    }
    return "<p style='text-align:center;'>???</p>";
}

/*
* Display the updated score.
*/
function renderScoring() {
    $("#points").text("Correct: " + score[0] + " | Incorrect: " + score[1] + " | Pass: " + score[2]);
}

/*
* Display the appropriate message if the answer is correct or not.
* correct - whether answer was correct or not
* name - name of the shoe that was correct
*/
function showCheckDisplay(correct, name) {
    $("#banner").html(createBanner(name, correct));
}

/*
* The actual game.
* brandnumber - Index of selected brand
*/
function game(brandnumber) {
    $("#brandselect").hide();
    $("#game").show();

    // Load brand data
    function readyUp() {
    $.ajax({
        url: "data/brands.json",
        dataType: "json",
        async: false,
        success: function(jsondata) {
        // Randomly choose a brand
        var brand = jsondata[brandnumber];
        // Load NAME.json in chosen brand directory
        $.ajax({
            url: "data/" + brand["dir"] + "/NAME.json",
            dataType: "json",
            async: false,
            success: function(data) {
            console.log("brand dir: " + brand["dir"]);
            var name = brand["name"];
            console.log("name = " + name);

            // Generate 3 different random integers as choices
            var successfulAdded = 0;
            while (successfulAdded < 3) {
                var gen = genRand(1, data["max"] - 1); // max = # of 'highest' file name
                // Check if integer exists in generated
                var notExistent = true;
                var i;
                for (i = 0; i < generated.length; i++) {
                    if (gen == generated[i]) {
                        notExistent = false;
                    }
                }
                // If integer doesn't exist in generated, add it
                if (notExistent) {
                    generated[successfulAdded] = gen;
                    successfulAdded++;
                }
            }
            console.log("generated = " + generated);

            // Generate an index for the correct choice
            correctGenerated = genRand(0, generated.length - 1);
            console.log("correctGenerated = " + correctGenerated);
            console.log("Correct #: " + generated[correctGenerated]);

            // Get choice names
            var i;
            for (i = 0; i < generated.length; i++) {
                $.ajax({
                    url: "data/" + brand["dir"] + "/" + generated[i] + ".json",
                    dataType: "json",
                    async: false,
                    success: function(namedata) {
                        var sname = namedata.name;
                        choiceNames[i] = name + " " + sname;
                        // Get the image as well for the correct choice
                        if (i == correctGenerated) {
                            correctImg = namedata.img;
                        }
                    }
                });
            }
            console.log("choiceNames = " + choiceNames.join(","));
            console.log("correctImg = " + correctImg);
        }});
    }});

    }

    function setupPage() {
        $("#shoe-image").attr("src", correctImg);
        $.each(choiceIds, function(i, val) {
            $(val).text(choiceNames[i]);
        });
    }

    function next() {
        renderScoring();
        readyUp();
        setupPage();
    }

    next();

    $(choiceIds.join(",")).click(function() {
        this.blur();
        // Check if correct
        var correct = false;
        for (b = 0; b < choiceIds.length; b++) {
            if (this.id == "b" + (correctGenerated+1)) {
                correct = true;
            }
        }
        if (correct) {
            score[0]++;
        } else {
            score[1]++;
        }
        // Display appropriately
        showCheckDisplay(correct, choiceNames[correctGenerated]);
        next();
    });

    $("#next").click(function() {
        score[2]++;
        next();
    });
}

$(document).ready((function() {
    $("#game").hide();
    // store button IDs to check on later
    var button_list = [];
    $.ajax({
        url: "data/brands.json",
        dataType: "json",
        async: false, // false if breaks everything
        success: function(data) {
            /*$.each(data, function(num, value) {
                // make a button for every brand
                $("#brandlist").add("<button type='button' class='btn btn-default' id='brandbutton" + num + "'>" + data[num].name + "</button>");
                button_list.push("brandbutton" + num);
            });*/
            var num;
            for (num = 0; num < data.length; num++) {
                button_list.push("#brandbutton" + num);
            }
        }
    });

    $(button_list.join(",")).click(function() {
        console.log(this.id.substr("brandbutton".length, this.id.length));
        game(parseInt(this.id.substr("brandbutton".length, this.id.length)));
    });
}));
