// Due to some fuckery and stuff, testing should be done on the server, I assume

function genRand(min, max) {
    return Math.floor((Math.random() * max) + min);
}

var points = 0;
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
* Display the appropriate message if the answer is correct or not.
* correct - whether answer was correct or not
* name - name of the shoe that was correct
*/
function showCheckDisplay(correct, name) {
    if (correct) {
        points++;
        alert("Correct! The shoe was '" + name + "'");
    } else {
        alert("Wrong! The shoe was '" + name + "'");
    }
    $("#points").text(points);
}

/*
* Set '.choice' buttons to be disabled.
* disabled - Set to true of disabled buttons are desired
*/
function disableChoices(disabled) {
    $.each(choiceIds, function(i, val) {
        $(val).prop("disabled", disabled);
    });
}

$(document).ready((function() {
    // Load brand data
    function readyUp() {
    $.ajax({
        url: "data/brands.json",
        dataType: "json",
        async: false,
        success: function(jsondata) {
        // Randomly choose a brand
        var brand = jsondata[genRand(0, jsondata.length-1)];
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
                var gen = genRand(1, data["max"]); // max = # of 'highest' file name
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
            correctGenerated = genRand(0, generated.length);
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
    
    readyUp();
    setupPage();

    $(choiceIds.join(",")).click(function() {
        // Disable buttons
        disableChoices(true);
        // Check if correct
        var correct = false;
        for (b = 0; b < choiceIds.length; b++) {
            if (this.id == "b" + (correctGenerated+1)) {
                correct = true;
            }
        }
        // Display appropriately
        showCheckDisplay(correct, choiceNames[correctGenerated]);
    });

    $("#next").click(function() {
        // Enable buttons
        disableChoices(false);
        // Go again
        console.log("----going again----");
        readyUp();
        setupPage();
    });
}));
