let campaigns = []
let monstersList = []
let monsterName = ""
let opNormal = false
let opHard = false
let opCrazy = false
let opNightmare = false
let firstInput = 0
let searchTitle = ""

function addMonster(arr) {
	for (let i = 0; i < arr.length; i++) {
		if (monstersList.find(x => x === arr[i].name)) {			
			return			
		}
		
		monstersList.push(arr[i].name);
	}
}

function buildCampaigns() {
	let data = getData()
	for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].levels.length; j++) {			
			campaigns.push({
				campaign: data[i].campaign,
			    levelname: data[i].levels[j].levelname.trim()+" ["+data[i].levels[j].difficulty+"-"+data[i].levels[j].levelnumber+"]",
				difficulty: data[i].levels[j].difficulty,
				energy: data[i].levels[j].energy,
				totalmana: data[i].levels[j].totalmana,
				monsters: data[i].levels[j].monsters,
				factions: data[i].levels[j].factions
			})
			
			addMonster(data[i].levels[j].monsters)
			addMonster(data[i].levels[j].factions)			
        }
    }
}

function findInArray(arr) {
	for (let i = 0; i < arr.length; i++) {
		if (arr[i].name === monsterName) {
			return arr[i].total
		}
	}
	return 0
}

function selectAmount(el) {	
    let amount = findInArray(el.monsters)
	
	if (amount == 0) 
		amount = findInArray(el.factions)
	
	return amount
}

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

function isSelected(difficulty) {
	if (difficulty == "NO" && opNormal)
		return true
	
	if (difficulty == "HA" && opHard)
		return true
	
	if (difficulty == "CR" && opCrazy)
		return true
	
	if (difficulty == "NM" && opNightmare)
		return true
	
	return false
}

function filterMonster() {
    let monsters = campaigns.map(function(el, i) {
        return { 			
			campaign: el.campaign,
			levelname: el.levelname,
			difficulty: el.difficulty, 
			amount: selectAmount(el)
		}
    })

    monsters = monsters.filter(x => x.amount > 0 && isSelected(x.difficulty))
	monsters = sortDescAmount(monsters)
	
	if (firstInput > 0) {
		monsters = monsters.slice(0, firstInput)
	}

    return monsters
}

function injectHtml(idselector, html) {
	let el = document.querySelector(idselector)
    el.innerHTML = "";
    el.insertAdjacentHTML('afterbegin', html)
}

function insertResult(arrayData) {
    let result = 
        "<table>"+
        "<thead>"+
        "  <tr>"+
        "    <th>Campaign</th>"+
        "    <th>Level</th>"+
        "    <th>"+searchTitle+"</th>"+
        "  </tr>"+
        "</thead>"+
        "<tbody>"

    for (i = 0; i < arrayData.length; i++) {
        result += "<tr>"+
            "<td>"+arrayData[i].campaign+"</td>"+
            "<td>"+arrayData[i].levelname+"</td>"+
			"<td>"+arrayData[i].amount+"</td>"

        result += "</tr>"
    }

    result += 
        "</tbody>"+
        "</table>"
		
	injectHtml("#span-result", result)
}

function buildMonstersList() {
	let options = ""
	
	for (let i = 0; i < monstersList.length; i++) {
		options += "<option value='"+monstersList[i]+"'>"
	}
	
	injectHtml("#monsters-list", options)
}

function setParameters() {
	monsterName = document.getElementById("input-monster").value
	opNormal = document.getElementById("input-normal").checked
	opHard = document.getElementById("input-hard").checked
	opCrazy = document.getElementById("input-crazy").checked
	opNightmare = document.getElementById("input-nightmare").checked
	firstInput = document.getElementById("input-first").value
}

function findLevels() {
    setParameters()
	searchTitle = document.getElementById("input-monster").value
	
	let result = filterMonster()
    insertResult(result)    
}

function listTotalMana() {
	setParameters()
	searchTitle = "Total Mana"
	
	let listTotalMana = campaigns.map(function(el, i) {
        return { 			
			campaign: el.campaign,
			levelname: el.levelname,
			difficulty: el.difficulty, 
			amount: el.totalmana
		}
    })

    listTotalMana = listTotalMana.filter(x => isSelected(x.difficulty))
	listTotalMana = sortDescAmount(listTotalMana)   
	
	if (firstInput > 0) {
		listTotalMana = listTotalMana.slice(0, firstInput)
	}
		
    insertResult(listTotalMana)
}

window.onload = function() {	
	buildCampaigns()
	buildMonstersList()
}