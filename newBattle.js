var Battle = function (obj, bAlliesArray, bEnemiesArray) {
    if (bAlliesArray.length === undefined) {
        bAlliesArray = [bAlliesArray];
    }
    if (bEnemiesArray.length === undefined) {
        bEnemiesArray = [bEnemiesArray];
    }
    obj.bAlliesArray = bAlliesArray
    obj.bEnemiesArray = bEnemiesArray
    obj.competitorArray = obj.bAlliesArray.concat(obj.bEnemiesArray)
    obj.bTime = 0
    for (var i = 0; i < bAlliesArray.length; i++) {
        bAlliesArray[i].ally = true;
    }
    for (var i = 0; i < bEnemiesArray.length; i++) {
        bEnemiesArray[i].enemy = true;
    }
    $.extend(obj, Battle.methods)
    for (var i = 0; i < obj.competitorArray.length; i++) {
        if (obj.competitorArray[i].ally) {
            obj.bTurnAllyConstructor(i);
        } else {
            obj.bTurnEnemyConstructor(i);
        }
        obj.bgConLogConstructor(obj.competitorArray[i]);
        obj.bDamagerConstructor(obj.competitorArray[i]);
        //obj.competitorArray[i].bgConLog = obj.bgConLog;
    }
    return obj
}

Battle.methods = {
    mainLoop: function (participantArray) {
        //var iTime = 0 //for DoT tick checks and for temporary early escape
        while (this.victoryCheck(participantArray) !== true) {
            for (var i = 0; i < participantArray.length; i++) {
                //participantArray[i].timestep(iTime);
                participantArray[i].timestep(this.bTime);
            } //temporary early break stuff
            if (this.bTime === 1000) {
                return 'early break due to too many reps'
            }
            //Refresh Allies?
            this.bTeamStatsUpdate(this.bAlliesArray);
            this.bTeamStatsUpdate(this.bEnemiesArray);
            //iTime++;
            this.bTime++;
        }
        console.log('(fight ended due to victory or defeat.)')
    },
    victoryCheck: function (competitorArray) {
        if (this.allies(competitorArray).length === 0) {
            console.log("Defeat!");
            return true;
        }
        if (this.enemies(competitorArray).length === 0) {
            console.log("Victory!", "Time: " + this.bTime);
            return true;
        }
        //console.log("the fight continues");
        return false;
    },
    allies: function (competitorArray) {
        allyList = [];
        for (var i = 0; i < competitorArray.length; i++) {
            if (competitorArray[i].ally) {
                if (competitorArray[i].hp > 0) {
                    allyList.push(competitorArray[i]);
                }
            }
        }
        return allyList
    },
    enemies: function (competitorArray) {
        enemyList = [];
        for (var i = 0; i < competitorArray.length; i++) {
            if (competitorArray[i].ally !== true) {
                if (competitorArray[i].hp > 0) {
                    enemyList.push(competitorArray[i]);
                }
            }
        }
        return enemyList
    },
    binit: function () {
        this.bTeamStatsInit(this.bAlliesArray, "bAlliesStats");
        this.bTeamStatsInit(this.bEnemiesArray, "bEnemiesStats");
        this.bTeamStatsUpdate(this.bAlliesArray);
        this.bTeamStatsUpdate(this.bEnemiesArray);
        document.getElementById('b_html_combat_history').innerHTML = "<h3>Combat History Log</h3>"
        this.mainLoop(this.competitorArray);

    },
    bTeamStatsInit: function (competitorArray, docTeamId) {
        var bcuri = 0;
        var bresult = "";
        document.getElementById(docTeamId).innerHTML = ""
        while (bcuri < competitorArray.length) {
            var biresult = "<div class=col-" + 12 / competitorArray.length + " id=" + competitorArray[bcuri].htmlname + bcuri.toString() + "></div>";
            bresult = bresult.concat(biresult);
            bcuri++;
        }
        document.getElementById(docTeamId).innerHTML = bresult;
    },
    bTeamStatsUpdate: function (competitorArray) {
        var bcuri = 0;
        while (bcuri < competitorArray.length) {
            document.getElementById(competitorArray[bcuri].htmlname + bcuri.toString()).innerHTML = "<p>" + competitorArray[bcuri].uname + "</p>" + "<p>HP: " + competitorArray[bcuri].hp + "</p>" + "<p> Readiness: " + competitorArray[bcuri].rdy + "</p>" + "</div>";
            bcuri++;
        }
    },
    bgConLog: function (bConLogText) {
        var conLogUpdate = "[" + this.bTime.toString() + "] " + bConLogText;
        console.log(conLogUpdate);
        var conLogInterim = document.getElementById('b_html_combat_history').innerHTML;
        document.getElementById('b_html_combat_history').innerHTML = conLogInterim+"<br>"+conLogUpdate;
        //Add code to add bConLogText to the html itself
    },
    bgConLogConstructor: function (bagent) {
        Object.defineProperty(bagent, 'bConLog', {
            value: function (bConLogText) {
                var conLogUpdate = "[" + this.bTime.toString() + "] " + bConLogText;
                console.log(conLogUpdate);
                var conLogInterim = document.getElementById('b_html_combat_history').innerHTML;
                document.getElementById('b_html_combat_history').innerHTML = conLogInterim+"<br>"+conLogUpdate;
            }
        })
    },
    bDamagerConstructor: function (bagent) {
        Object.defineProperty(bagent, 'dmg', {
            value: function (btarget, bagent, bvalue) {
                btarget.hp = btarget.hp - bvalue;
                bagent.bConLog(bagent.uname + " hit " + btarget.uname + " for " + bvalue + " hp.");
                //other stuff for triggered events?
            }
        })
    },
    bTurnAllyConstructor: function (bArrayNum) {
        var bcEnemiesArray = this.bEnemiesArray;
        var bcCompetitor = this.competitorArray[bArrayNum];
        Object.defineProperty(this.competitorArray[bArrayNum], 'trn', {
            value: function () {
                bcCompetitor.dmg(bcEnemiesArray[Math.floor(Math.random() * bcEnemiesArray.length)], bcCompetitor, bcCompetitor.atk);
                bcCompetitor.rdy = -1000;

            }
        })
        //return this.competitorArray[bArrayNum].trn;
    },
    bTurnEnemyConstructor: function (bArrayNum) {
        var bcAlliesArray = this.bAlliesArray;
        var bcCompetitor = this.competitorArray[bArrayNum];
        Object.defineProperty(this.competitorArray[bArrayNum], 'trn', {
            value: function () {
                bcCompetitor.dmg(bcAlliesArray[Math.floor(Math.random() * bcAlliesArray.length)], bcCompetitor, bcCompetitor.atk);
                bcCompetitor.rdy = -1000;
            }
        })
        //return this.competitorArray[bArrayNum].trn;
    }
}






//Superclass for both ally and enemy participants

var placeHolder = function () {
    return "you should never see this"
}

var UnitCompetitor = function (obj, uname, mhp, atk, spd, def) {
    obj.uname = uname;
    obj.htmlname = uname.replace(" ", "_")
    obj.mhp = mhp;
    obj.hp = obj.mhp; //Make sure this does immutable assignment!
    obj.atk = atk;
    obj.spd = spd;
    obj.def = def;
    obj.rdy = -1000;
    obj.act = 0;
    obj.ugo = false;
    obj.trn = placeHolder; //Might be unnecessary.
    obj.dmg = placeHolder;
    obj.bConLog = placeHolder;
    $.extend(obj, UnitCompetitor.methods);
    return obj
}

UnitCompetitor.methods = {
    //still editing timestep
    timestep: function (timeValue) {
        if (timeValue === undefined) {
            timeValue = 0
        }
        this.bTime = timeValue
        if (this.rdy <= 0) {
            this.rdy = this.rdy + this.spd;
        }
        if (this.rdy > 0) {
            this.rdy = this.rdy + 10 + Math.pow(this.spd, 1 / 3)
        }
        //console.log(this.uname+" is "+this.rdy.toString()+" ready at "+timeValue.toString())
        if (this.dots) {
            for (var i = 0; i < this.dots.length; i++) {
                this.dots[i].fx(timeValue);
            }
        }
        if (this.rdy >= this.act) {
            this.trn();
        } //how can I get this function to reference the Battle Object???  What if battle assigns the property's attribute?
    }
    // ,
    // turn : function() {
    //  if(this.ugo = false) {
    //      this.act = 1000;
    //      this.ugo = true;
    //  } else {


    //      this.act = 0
    //      this.ugo = false
    //      this.rdy = -1000
    //  }
    // },
    // uTestThis : function() {
    //  return this
    // }
}




var hero = UnitCompetitor({}, 'Shepherd', 100, 10, 10, 10)
var heroine = UnitCompetitor({}, 'Iura', 80, 10, 12, 8)

var shero = UnitCompetitor({}, 'Shadow Shepherd', 100, 10, 10, 10)


var DotConstructor = function (obj, zDotText, zDotRecipient, zDotFreq, zDotDamageC, zDotGiver) {
    if (zDotFreq === undefined) {
        zDotFreq = 1;
    }
    if (zDotGiver === undefined) {
        zDotGiver = zDotRecipient;
    }
    obj.zDotText = zDotText;
    obj.zDotRecipient = zDotRecipient;
    obj.zDotFreq = zDotFreq;
    obj.zDotDamageC = zDotDamageC;
    obj.zDotGiver = zDotGiver;
    $.extend(obj, DotConstructor.methods);
    return obj;
}

DotConstructor.methods = {
    fx: function (timeValue) {
        if (timeValue % this.zDotFreq === 0) {
            this.zDotRecipient.hp = this.zDotRecipient.hp - this.zDotDamageC * this.zDotGiver.atk;
            console.log(this.zDotText);
        }
    }
}

var sfade = DotConstructor({}, "the shadow fades!", shero, 100, 1, shero);





shero.dots = [sfade]

$.extend(shero, shero.dots)

var sduo = [hero, shero]




var tBattle = Battle({}, hero, shero)

var fBattle = Battle({}, heroine, shero)

var twBattle = Battle({}, [hero, heroine], shero)
    // var battleInit = function() {


// }
