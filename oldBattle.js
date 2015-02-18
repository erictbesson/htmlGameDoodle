//old script code
//Main Loop
var mainLoop = function (participantArray) {
    var iTime = 0 //for DoT tick checks and for temporary early escape
    while (victoryCheck(participantArray) !== true) {
        for (var i = 0; i < participantArray.length; i++) {
            participantArray[i].timestep(iTime);
        }
        //temporary early break stuff
        if (iTime === 100) {
            return 'early break due to too many reps'
        }
        iTime++
    }
    console.log('(fight ended due to victory or defeat.)')
}

var victoryCheck = function (competitorArray) {
    //Eventually add code here to remove defeated heroes from competitorArray
    if (allies(competitorArray).length === 0) {
        console.log("Defeat!");
        return true;
    }
    if (enemies(competitorArray).length === 0) {
        console.log("Victory!");
        return true;
    }
    console.log("the fight continues");
    return false;
}



//My goal here is to make a list of allies.  Ideally I want a list of allies that other things can access   
//Wouldn't another method be to define the set during the initialization?

//Note that the current allies and enemies functions require array
var allies = function (competitorArray) {
    allyList = [];
    for (var i = 0; i < competitorArray.length; i++) {
        if (competitorArray[i].ally) {
            if (competitorArray[i].hp > 0) {
                allyList.push(competitorArray[i]);
            }
        }
    }
    return allyList
}

var enemies = function (competitorArray) {
    enemyList = [];
    for (var i = 0; i < competitorArray.length; i++) {
        if (competitorArray[i].ally !== true) {
            if (competitorArray[i].hp > 0) {
                enemyList.push(competitorArray[i]);
            }
        }
    }
    return enemyList
}
