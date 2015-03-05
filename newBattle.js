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
		obj.bAttackChoiceConstructor(i);
		obj.competitorArray[i].pos = i;

		//obj.competitorArray[i].bgConLog = obj.bgConLog;
	}
	return obj
}

Battle.methods = {
	mainLoop: function () {
		//Removed the loop in order to replace with a self calling function so that timeouts can separate loops
		// while (this.victoryCheck(participantArray) !== true) {
		if (this.bTime === 10000) {
			return 'early break due to too many reps'
		}
		for (var i = 0; i < this.competitorArray.length; i++) {
			this.competitorArray[i].timestep(this.bTime);
			//Needs functionality for ally turns.
		} //temporary early break stuff
		this.bTeamStatsUpdate(this.bAlliesArray);
		this.bTeamStatsUpdate(this.bEnemiesArray);
		this.bTime++;
		if (this.victoryCheck(this.competitorArray) === true) {
			clearInterval(this.bInterval);
			this.bVictory = true;
			console.log('(fight ended due to victory or defeat.)');
			return '(fight ended due to victory or defeat.)';
		}
	},
	// bTimeStep: function (participantArray) {
	// 	for (var i = 0; i < participantArray.length; i++) {
	// 		//participantArray[i].timestep(iTime);
	// 		participantArray[i].timestep(this.bTime);
	// 	} //temporary early break stuff
	// 	//Refresh Allies?
	// 	this.bTeamStatsUpdate(this.bAlliesArray);
	// 	this.bTeamStatsUpdate(this.bEnemiesArray);
	// 	//iTime++;
	// 	this.bTime++;
	// },
	victoryCheck: function (competitorArray) {
		if (this.allies(competitorArray).length === 0) {
			this.bgConLog("Defeat!");
			return true;
		}
		if (this.enemies(competitorArray).length === 0) {
			this.bgConLog("Victory!");
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
		//Use setInterval in order to get the battle to run at a set speed.
		document.getElementById('b_html_combat_history').innerHTML = "<h3>Combat History Log</h3>"
		this.bInterval = setInterval(
			(function(self) {         //Self-executing func which takes 'this' as self
				return function() {   //Return a function in the context of 'self'
					self.mainLoop(); //Thing you wanted to run as non-window 'this'
				}
			})(this),
			10     //normal interval, 'this' scope not impacted here.
		);
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
			document.getElementById(competitorArray[bcuri].htmlname + bcuri.toString()).innerHTML = "<p>" + competitorArray[bcuri].uname + "</p>" + "<p>HP: " + competitorArray[bcuri].hp + "/" + competitorArray[bcuri].mhp + " | " + competitorArray[bcuri].rdy + " Ready</p>" + "</div>";
			competitorArray[bcuri].locHTMLId = competitorArray[bcuri].htmlname + bcuri.toString();
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
	},
	bAllyTurnChoice: function(bArrayNum) {
		var bcEnemiesArray = this.bEnemiesArray;
		var bcCompetitor = this.competitorArray[bArrayNum];
		//this.bCUpdateLast = document.getElementById(bcCompetitor.htmlname + bArrayNum.toString()).innerHTML;
		document.getElementById(bcCompetitor.htmlname + bArrayNum.toString()).innerHTML = document.getElementById(bcCompetitor.htmlname + bArrayNum.toString()).innerHTML+"<div class=battack_option id="+bcCompetitor.htmlname + bArrayNum.toString()+"_battack_option><u>A</u>ttack</div>";
		this.allyActChoice = false;
		document.getElementById(bcCompetitor.htmlname+bArrayNum.toString()+"_battack_option").onclick = (
			function (self) {
				return function() {
					self.allyActChoice = bcCompetitor.bAttackChoice();	//run the character's action property.
					self.bTeamStatsUpdate(self.bAlliesArray);	//update the display, getting rid of attack.
				}
			}
		)(this);
		
				//Clear the battle's mainloop?  This presents a slight context issue.  How about have it forward to the mainloop information that will tell the main loop to pause?
		
	},
	//Currently not using the battle's version of this function.  Need to decide ultimate placement of these things anyway.  Probably should write a constructor.
	bAttackChoiceConstructor: function (bArrayNum) {
		Object.defineProperty(this.competitorArray[bArrayNum], 'bAttackChoice', {
			value: function () {
				console.log("wham!!! Attack choice made");
				this.allyActChoice = "attack";
				//Do more stuff like actual damage.
				return this.allyActChoice;
			}
		})

		//document.getElementById(this.competitorArray[bArrayNum].htmlname + bArrayNum.toString()).innerHTML = this.bCUpdateLast;//This code worked when I typed it into the console manually.  Or when I ran code on its own.  Why does the wham part work and auto-play???
	},
	//I don't think I need this waiter if I just add move the code/commands to the onclick function instead.
	bAllyTurnChoiceWaiter: function(bArrayNum) {
		this.bWaitInterval = setInterval(
			(function(self) {         //Self-executing func which takes 'this' as self
				return function() {   //Return a function in the context of 'self'
					if (self.allyActChoice) {
						clearInterval(self.bWaitInterval);
						console.log("bAllyTurnChoiceWaiter is running");
						self.bTeamStatsUpdate(this.bAlliesArray);
					}
				}
			})(this),
			10     //normal interval, 'this' scope not impacted here.
		);
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
	obj.atkAct = placeHolder;
	obj.bAttackChoice = placeHolder;
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

var bBattlePicker = function(paraBattle) {
	document.getElementById("bbattle_picker").innerHTML = "";
	paraBattle.binit();
}

// }
