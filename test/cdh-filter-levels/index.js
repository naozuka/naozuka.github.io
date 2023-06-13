let monstersList = []

// Structure
const CAMPAIGN_POS = 0
const MONSTERS_POS = 1
const FACTIONS_POS = 2
const ALL_LEVELS_POS = 3
	const ENERGY_POS = 0
	const DIFFICULTY_POS = 1
	const LEVEL_POS = 2
		const TOTAL_MANA_POS = 0
		const MONSTERS_COUNT_POS = 1
		const FACTIONS_COUNT_POS = 2

function sortDescAmount(arr) {
	arr.sort(function(a, b) {
        if (a.amount < b.amount) 
            return 1
        else if (a.amount > b.amount) 
            return -1

        return 0
    }) 
	
	return arr
}

function injectHtml(idselector, html) {
	let el = document.querySelector(idselector)
    el.innerHTML = "";
    el.insertAdjacentHTML('afterbegin', html)
}

function insertResult(arrayData, searchTitle) {
	if (arrayData.length == 0) {
		return
	}
	
    let result = 
        "<table>"+
        "<thead>"+
        "  <tr>"+
        "    <th>Campaign - Level</th>"+
		"    <th>Energy</th>"
		
	if (arrayData[0].totalMana != undefined) {
		result += "<th>Total Mana</th>"
	}
	
	result +=			
        "    <th>"+searchTitle+"</th>"+
        "  </tr>"+
        "</thead>"+
        "<tbody>"

    for (i = 0; i < arrayData.length; i++) {
        result += "<tr>"+
            "<td>"+arrayData[i].campaign+" - "+arrayData[i].levelName+"</td>"+
			"<td>"+arrayData[i].energy+"</td>"
			
		if (arrayData[0].totalMana != undefined) {
			result += "<td>"+arrayData[i].totalMana+"</td>"
		}
		
		result += "<td>"+arrayData[i].amount+"</td>"
        result += "</tr>"
    }

    result += 
        "</tbody>"+
        "</table>"
		
	injectHtml("#span-result", result)
}

function buildMonstersList() {	
	for (let i = 0; i < MONSTERS.length; i++) {
		monstersList.push(MONSTERS[i])
	}
	
	for (let i = 0; i < FACTIONS.length; i++) {
		monstersList.push(FACTIONS[i])
	}
	
	let options = ""	
	for (let i = 0; i < monstersList.length; i++) {
		options += "<option value='"+monstersList[i]+"'>"
	}
	
	injectHtml("#monsters-list", options)
}

function getParameters() {
	const searchValue = document.getElementById("input-monster").value
	
	let isMonster = false
	let searchId = FACTIONS.indexOf(searchValue)	
	
	if (searchId == -1) {
		searchId = MONSTERS.indexOf(searchValue)
		isMonster = true
	}
	
	return {
		searchValue: searchValue,
		searchId: searchId,
		isMonster: isMonster,
		top: parseInt(document.getElementById("input-first").value),
		listTotalMana: false,
		difficulties: {
			normal: document.getElementById("input-normal").checked,
			hard: document.getElementById("input-hard").checked,
			crazy: document.getElementById("input-crazy").checked,
			nightmare: document.getElementById("input-nightmare").checked
		}
	}
}

function isDifficultySelected(difficulty, difficulties) {
	if ((difficulty == 0 && difficulties.normal) || 
	    (difficulty == 1 && difficulties.hard) ||
	    (difficulty == 2 && difficulties.crazy) ||
	    (difficulty == 3 && difficulties.nightmare)) {
		return true
	}
	
	return false
}

function getDifficultyDescription(difficulty) {
	let description = "";
	switch (difficulty) {
		case 0: description = "NO" 
			break
		case 1: description = "HA" 
			break
		case 2: description = "CR" 
			break
		case 3: description = "NM" 
			break
	}
	return description
}

function filterMonster(parameters) {
	let filtered = []

	console.log(parameters)
	
	for (let campaignIdx = 0; campaignIdx < CAMPAIGNS.length; campaignIdx++) { // campaigns
		var campaign = CAMPAIGNS[campaignIdx]
		const indexMonster = (parameters.isMonster ? MONSTERS_POS : FACTIONS_POS)		
		const searchIndex = campaign[indexMonster].indexOf(parameters.searchId)

		if (!parameters.listTotalMana && searchIndex == -1) {
			continue
		}
		
		for (let j = 0; j < campaign[ALL_LEVELS_POS].length; j++) { // campaign by difficulty
			const difficulty = campaign[ALL_LEVELS_POS][j]			
			
			if (!isDifficultySelected(difficulty[DIFFICULTY_POS], parameters.difficulties)) {
				continue
			}

			console.log(difficulty, campaign[CAMPAIGN_POS])

			for (let levelIdx = 0; levelIdx < difficulty[LEVEL_POS].length; levelIdx++) { // levels			
				const level = difficulty[LEVEL_POS][levelIdx]
				
				let amount = 0
				if (parameters.listTotalMana) {
					amount = level[TOTAL_MANA_POS]
				} else {			
					const indexToFilter = (parameters.isMonster ? MONSTERS_COUNT_POS : FACTIONS_COUNT_POS)
					amount = level[indexToFilter][searchIndex]
				}
				
				filtered.push({
					campaign: campaign[CAMPAIGN_POS],
					levelName: LEVELS[campaignIdx][levelIdx]+" ["+
						getDifficultyDescription(difficulty[DIFFICULTY_POS])+"-"+
						(levelIdx+1).toString()+"]",
					energy: difficulty[ENERGY_POS],
					totalMana: level[TOTAL_MANA_POS],
					amount: amount
				})
			}
		}		
	}
	
	filtered = sortDescAmount(filtered)
	filtered = filtered.slice(0, parameters.top)

    return filtered
}

function findLevels() {    
	const parameters = getParameters()	
	const searchTitle = document.getElementById("input-monster").value
	
	const result = filterMonster(parameters)
    insertResult(result, searchTitle)
}

function listTotalMana() {
	let parameters = getParameters()
	parameters.listTotalMana = true
	const searchTitle = "Total Mana"	
	
	const result = filterMonster(parameters)
    insertResult(result, searchTitle)
}

function updateMonsterList() {
	let input = document.getElementById("input-monster")	
}

window.onload = function() {
	buildMonstersList()
	
	document.getElementById("input-monster").value = "Armored Orc"	
	const parameters = getParameters()	
	const result = filterMonster(parameters)
	insertResult(result, "Armored Orc")	
}