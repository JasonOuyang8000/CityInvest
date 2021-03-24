import {Building, CollectBuilding} from './assets/classes/building.js';

// Dom Elements
const bgCanvas = document.getElementById('bg-view');
const gameCanvas = document.getElementById('game-view');
const weatherCanvas = document.getElementById('weather-view');
const buildingsOption = document.querySelectorAll('.buildings-option');
const selectedOption = document.getElementById('selected-option');
const modalBackground = document.getElementById('modal-background');
const modal = document.getElementById('modal');
const time = document.getElementById('time');
const gameMessage = document.getElementById('game-message');
const magicShield = document.getElementById('magic-shield');
const start = document.querySelector('.control').children[1];
const reset = document.querySelector('.control').children[0];
// Globals
let gameTimer = null;
let gameClock = 0;
let user = null;
let regions = null;
let randomTimer = null;
let timer = null;
let randomTime = null;
let idCounter = 0;
let battleState = false;
let messageTimer = null;
let wildRegions = null;
let levels = [
    {   
        regions:[600, 700, 800, 900, 1000, 1100, 1200],
        encounterRate: 0.2,
        winRate: 0.95,
        losePotential: 0.2,
        winPotential: 0.01,
        imageUrl: './assets/images/monster/Globin.png',
        name: 'Globin',
    },
    {   
        regions:[500, 1300],
        encounterRate: 0.5,
        winRate: 0.6,
        losePotential: 0.2,
        winPotential: 0.03,
        imageUrl: './assets/images/monster/Centipede.png',
        name: 'Centipede',
    },
    {   
        regions:[400, 1400],
        encounterRate: 0.7,
        winRate: 0.5,
        losePotential: 0.3,
        winPotential: 0.05,
        imageUrl: './assets/images/monster/Hyena.png',
        name: 'Hyena',
    },
    {
        regions:[300, 1500],
        encounterRate: 0.8,
        winRate: 0.45,
        losePotential: 0.4,
        winPotential: 0.3,
        imageUrl: './assets/images/monster/Toad.png',
        name: 'Toad',
    },
    {
        regions:[200, 1600],
        encounterRate: 0.97,
        winRate: 0.4,
        losePotential: 0.5,
        winPotential: 0.5,
        imageUrl: './assets/images/monster/Scorpio.png',
        name: 'Scorpion',
    },
    {
        regions:[100, 1700],
        encounterRate: 0.97,
        winRate: 0.3,
        losePotential: 0.65,
        winPotential: 0.6,
        imageUrl: './assets/images/monster/Vulture.png',
        name: 'Vulture',
    },
    {
        regions:[0,1800],
        encounterRate: 0.99,
        winRate: 0.15,
        losePotential: 0.7,
        winPotential: 1,
        imageUrl: './assets/images/monster/Rhino.png',
        name: 'Rhino',
    },
]


const allBuildings = [
    {name: 'Farm', imageUrl: './assets/images/buildings/farm.svg',type: 'food', cost: {gold: 20},capacity: 10, info: 'A farm accumulates food. It costs 20 gold.',growth: 1},
    {name: 'Tower', imageUrl: './assets/images/buildings/tower.svg',type: 'stats',cost:{stone: 50, wood: 10},info: 'Increase your defense by 10.It cost 50 stone and 10 wood.'},
    {name: 'Blacksmith', imageUrl: './assets/images/buildings/blacksmith.svg',type: 'stats', cost:{gold: 10},  info:'Increases your overall attack by 10. It costs 10 gold.'},
    {name: 'Pub', imageUrl: './assets/images/buildings/Pub.svg',type: 'gold',cost:{food: 80}, capacity: 50, info: 'A accumulates gold. It costs 80 food.',growth: 1},
    {name: 'Fishing', imageUrl: './assets/images/buildings/fishing.svg',type: 'food', cost:{wood: 30}, capacity: 10, info: 'Fishing accumulates more food.It costs 30 wood.',growth: 2},
    {name: 'Barracks', imageUrl: './assets/images/buildings/barracks.svg',type: 'stats', cost:{gold: 50},info:'Trains attack and defense. Cost 50 gold.'},
    {name: 'Pyramid', imageUrl: './assets/images/buildings/pyramid.svg',type: 'gold',cost: {stone: 50},  capacity: 20, info:'Accumulates more gold. Cost 50 stone.',growth: 1},
];
let selected = 'Farm';

weatherCanvas.width = weatherCanvas.scrollWidth;
weatherCanvas.height = weatherCanvas.scrollHeight;
bgCanvas.width = bgCanvas.scrollWidth;
bgCanvas.height = bgCanvas.scrollHeight;
gameCanvas.width = bgCanvas.scrollWidth;
gameCanvas.height = bgCanvas.scrollHeight;
const bgCtx = bgCanvas.getContext('2d');
const gameCtx = gameCanvas.getContext('2d');
const weatherCtx = weatherCanvas.getContext('2d');

const renderUserStats = () => {
    document.querySelector('#food').innerText = user.food;
    document.querySelector('#gold').innerText = user.gold;
    document.querySelector('#villagers').innerText = user.villagers;
    document.querySelector('#defense').innerText = user.defense;
    document.querySelector('#attack').innerText = user.attack
    document.querySelector('#wood').innerText = user.wood;
    document.querySelector('#stone').innerText = user.stone;

}

const displayMessage = (html) => {
    if (messageTimer) {
        clearInterval(messageTimer);
        gameMessage.classList.add('hidden');
    }
    gameMessage.classList.remove('hidden');
    gameMessage.innerHTML = html;

    setTimeout(() => {
        gameMessage.classList.add('hidden');
    },1500);

}


const increaseCapacity = () => {
    user.userBuildings.filter(building => building.capacity).forEach(building => building.capacity += 10);

    if (document.querySelectorAll('#capacity')) {
        document.querySelectorAll('#capacity').forEach(node => node.innerText = parseInt(node.innerText) + 10);
    }
}


// Creates Array the regions in the map
const createRegions = (start, xSize, ySize) => {
    const {x ,y} = start;
    let region = [];
    let yJump = 0;

    for (let i = 0; i < ySize; i++) {
        let xJump = 0;
        for (let j = 0;  j < xSize; j++) {
            region.push([x + xJump,y + yJump]);
            xJump += 100;
        }
        yJump += 100;
        xJump = 0;
    }
    return region;
}



// return random number 
const randomNumber = (min,max) => {
    return Math.floor(Math.random() * (max- min)) + min;
}

const checkRegion = (clientX,clientY,regions) => {
    for (let i = 0; i < regions.length; i++) {
        if (clientX > regions[i][0] && clientX < regions[i][0] + 100 && clientY > regions[i][1] && clientY < regions[i][1] + 100) return true;
    }
    return false;
}

const showRegion = (clientX,clientY,regions) => {
    for (let i = 0; i < regions.length; i++) {
        if (clientX > regions[i][0] && clientX < regions[i][0] + 100 && clientY > regions[i][1] && clientY < regions[i][1] + 100) return [regions[i][0],regions[i][1]];
    }

}

const drawImage = (ctx,src,posX,posY,width,height) => {
    const image = new Image();
    image.src = src;
    image.onload = () => {
        ctx.drawImage(image, posX, posY, width, height);
    }
}

const resetGame = () => {
    magicShield.style.zIndex = "1";
    if (gameTimer) clearInterval(gameTimer);
    if (randomTimer){
        clearInterval(randomTimer);
        weatherCtx.clearRect(0,0,weatherCanvas.width,weatherCanvas.height)
    }
    gameClock = 0;
    randomTime = randomNumber(30,60);
    time.innerText = gameClock;
    regions = createRegions({x: 700, y: 100}, 5,5);
    user = {
        userBuildings: [],
        food: 0,
        gold: 20,
        wood: 0,
        stone: 0,
        defense: 10,
        attack: 10,
        villagers: 10,
        capacity: 10,
    }
    renderUserStats();
    populateStructures();
}

const loadGame = () => {
    resetGame();
    magicShield.style.zIndex = "-3";
    gameTimer = setInterval(() => {
        if (gameClock === randomTime) randomEvent();
        time.innerText = gameClock;
        gameClock++;
        checkGameState();
    }, 1000);
}


const checkGameState = () => {
    if (user.villagers === 0) {
        clearInterval(gameTimer);
        displayModal('<h1>Game Over You lost all your villagers.</h1>');
        resetGame();
    } 
    else if (gameClock === 120) {
        clearInterval(gameTimer);
        displayModal("<h1>Times Up!. You don't have 20 villagers</h1>");
        resetGame();
       
    }
    else if (user.villagers >= 20) {
        clearInterval(gameTimer);
        displayModal("<h1>You've won! You gained 20 villagers before the time limit.</h1>");
        resetGame();
    }

    
}

const isUserbuilding = (region) => {
    const {userBuildings} = user;
 ;
    for (let j = 0 ; j < userBuildings.length; j++) {
        if (JSON.stringify(region) === JSON.stringify(userBuildings[j].location)) return true;
    }
    
    return false;
}   

const menuHandler = (event, type, building) => {
    event.preventDefault();
    if (type === 'collect') {
        if (building.resource === 'food' || building.resource === 'gold') {
            user[building.resource] += building.total;
            building.collect();
            renderUserStats();
        }

    }

    else if (type === 'buy') {
        if (building.resource === 'villagers') {
            const amt = parseInt(event.target.elements[0].value);
            if (amt >= 1 && (amt * 10 <= user.food) && (amt * 10 <= user.gold)) {
                user.gold -= (amt * 10);
                user.food -= (amt * 10);
                user.villagers += amt;
                renderUserStats();
            }
        }
    }

}


const createMenu = building => {
    const tempDiv = document.createElement('div');
    const form = document.createElement('form');
    const p = document.createElement('p');
    const spanTotal = document.createElement('span');
    const button = document.createElement('button');
    p.innerText = `${building.resource[0].toUpperCase() +building.resource.slice(1,building.resource.length)} Collected `;
    p.append(spanTotal);
    spanTotal.id = `build-total-${building.id}` ;
    button.innerText = 'collect';
    form.append(p,button);
    tempDiv.append(form);
    tempDiv.id = 'form-collect';
    form.addEventListener('submit', (event) => menuHandler(event,'collect',building));
    return tempDiv;
}

const showMenu = (building) => {
    let innerhtml = `<div class="container"><h1>${building.name}</h1> <img class='modal-image' src='${building.imageUrl}'>`;
    if (building.name === 'Castle') {
        innerhtml += `<form><input type="number"> <button>Buy Villagers </button></form> <p>${building.info}</p> </div>`;
        modal.innerHTML = innerhtml;
        
        document.querySelector('#modal form').addEventListener('submit', (event) => menuHandler(event,'buy',building));
    } 

    else if (building.name === 'Farm' || building.name === 'Pyramid' || building.name === 'Pub' || building.name === "Fishing") {
        modal.innerHTML = innerhtml + '</div>';
        modal.append(createMenu(building));
    }

    else {
        innerhtml += `<p>${building.info}</p></div>`;
        modal.innerHTML = innerhtml;
    }
          


}


const gameClickHandler = e => {
    const {clientX, clientY} = e;
    if (checkRegion(clientX, clientY, regions)) {
        const currentRegion = showRegion(clientX, clientY, regions);
        
        if (isUserbuilding(currentRegion)) {
            modalBackground.classList.remove('hidden');
            modal.classList.remove('hidden');
            const currentBuilding = user.userBuildings.find(building => JSON.stringify(building.location) === JSON.stringify(currentRegion));
            showMenu(currentBuilding);
        }

        else {
            if (checkBuilding()) createBuilding(clientX, clientY, regions);
        }
    }

    else {
        if (checkRegion(clientX,clientY,wildRegions)) {
            const currentRegion = showRegion(clientX,clientY,wildRegions);
            explore(currentRegion);
        }
    }
}

const actionHandler = (action,level,event) => {
    const randomNum = Math.random();
    const runRate = (user.defense + 50) / 100;
    let message = null;
    if (action === 'run') {
        if (randomNum < runRate) {
            message = `<h1>Run Successful`;
        }
    
        else {
            let losePotential = Math.ceil(level.losePotential * 10 * 0.4);
            losePotential = losePotential > user.villagers ? user.villagers : losePotential;
            message = `<h1>Run Not Successful.</h1> <h3>You lost ${losePotential} villager</h3>`;
            user.villagers -= losePotential;
        }
    }
    else if (action === 'fight') {
        if (randomNum < level.winRate + (user.attack / 100)) {
            message = `<h1>Fight Successful<h1> <h3>You gained ${level.winPotential * 100} wood,stone, and food.</h3>`;
            user.wood += level.winPotential * 100;
            user.stone += level.winPotential * 100;
            user.food += level.winPotential * 100;
        }
    
        else {
            let losePotential = Math.ceil(level.losePotential * 10);
            losePotential = losePotential > user.villagers ? user.villagers : losePotential;
            message = `<h1>You lost the fight. Maybe explore some where close to home.</h1> <h3>You lost ${losePotential} villagers</h3>`;
            user.villagers -= losePotential;
        }
    }
    if (!gameTimer) {
        gameTimer = setInterval(() => {
        if (gameClock === randomTime) randomEvent();
        time.innerText = gameClock;
        gameClock++;
        checkGameState();
    }, 1000);
    }   
  
    renderUserStats();
    displayModal(message);
    checkGameState();
    battleState = false;
    event.target.removeEventListener('click',actionHandler);
}



const explore = (currentRegion) => {
    const level = levels.find(level => level.regions.includes(currentRegion[0]));
    const randomEncounter = Math.random();
    let message = null;
    if (randomEncounter < level.encounterRate) {
        message = `<h1>A wild ${level.name} appeared!</h1> <button id="fight">Fight </button> <button id="run">Run Away</button> <img class="monster" src="${level.imageUrl}" />`;
        displayModal(message);
        document.querySelector('#run').addEventListener('click', (event) => actionHandler('run',level,event));
        document.querySelector('#fight').addEventListener('click', (event) => actionHandler('fight',level,event));
        battleState = true;
        clearInterval(gameTimer);
        gameTimer = null;
    }

    else {
        message = `<h3>You Got some resources with ease! You gained ${level.winPotential * 100} wood and stone</h3>`;
        displayMessage(message);
        user.wood += level.winPotential * 100;
        user.stone += level.winPotential * 100;
    }
    renderUserStats();
}


const checkBuilding = () => {
    const selectedBuilding = allBuildings.find(building => building.name === selected);
    const selectedBuildingCosts = Object.keys(selectedBuilding.cost);
    if (selectedBuildingCosts.every(resource => user[resource] >= selectedBuilding.cost[resource])) {
        selectedBuildingCosts.every(resource => user[resource] -= selectedBuilding.cost[resource]);
        renderUserStats();
        return true;
    }

    return false;
}


const displayModal = (innerContent) => {
    modalBackground.classList.remove('hidden');
    modal.classList.remove('hidden');
    modal.innerHTML = innerContent;
}



const createBuilding = (clientX, clientY, regions) => {
    const currentRegion = showRegion(clientX,clientY,regions);
    const currentBuilding = allBuildings.find(building => building.name === selected);
    let newBuilding = null;
        if (selected === 'Farm' || selected === 'Pyramid' ||  selected === 'Fishing' || selected === 'Pub' ) {
            idCounter++;
            newBuilding = new CollectBuilding(currentBuilding.name,currentBuilding.imageUrl, [currentRegion[0], currentRegion[1]], currentBuilding.type, currentBuilding.cost, currentBuilding.capacity,currentBuilding.info, currentBuilding.growth, idCounter);
            newBuilding.start();
        }
      
 
        else if (selected === 'Tower' || selected === 'Blacksmith' || selected === 'Barracks') {
            newBuilding = new Building(currentBuilding.name,currentBuilding.imageUrl, [currentRegion[0], currentRegion[1]], currentBuilding.type, currentBuilding.cost, currentBuilding.info);
            newBuilding.boost(user);
            renderUserStats();
        }
        
        else {
            newBuilding = new Building(currentBuilding.name,currentBuilding.imageUrl, [currentRegion[0], currentRegion[1]], currentBuilding.type, currentBuilding.cost, currentBuilding.info);
            newBuilding.boostBuildings(user.userBuildings);
            increaseCapacity();
            renderUserStats();
        }
          
    user.userBuildings.push(newBuilding);

    drawImage(gameCtx,currentBuilding.imageUrl, currentRegion[0], currentRegion[1], 90, 90);
}



const generateRandomCords = (intervalOne,intervalTwo,structures,amt) => {
    let count = 0;
    while (count <= amt) {
        const randomNumberX = randomNumber(intervalOne[0],intervalOne[1]); 
        const randomNumberY= randomNumber(intervalTwo[0], intervalTwo[1]);
        if (structures.includes([randomNumberX,randomNumberY])) continue;
        structures.push([randomNumberX,randomNumberY]);
        count ++;
    }

    return structures;
}

const populateStructures = () => {
    bgCtx.clearRect(0 ,0, bgCanvas.width, bgCanvas.height);
    gameCtx.clearRect(0,0, gameCanvas.width, gameCanvas.height);
    bgCtx.fillStyle = "#567d46";
    bgCtx.fillRect(0,0,bgCanvas.width, bgCanvas.height);
    const structures = [];
    drawImage(gameCtx,"./assets/images/buildings/castle.svg", 900, 300, 100, 100)
    user.userBuildings.push(new Building('Castle', "./assets/images/buildings/castle.svg",[900,300],'villagers', null, 'You can recruit Villagers in here. A Villager cost 10 food and 10 gold'));
    drawImage('castle');
    let leftRegion =  createRegions({x: 0, y: 0}, 7,8);
 
    let rightRegion = createRegions({x: 1200, y: 0}, 7,8);

    let topRegion = createRegions({x: 700, y: 0}, 6,1);
  
    let bottomRegion = createRegions({x: 700, y: 600}, 5,2);
    
    wildRegions = [...leftRegion,...rightRegion,...topRegion,...bottomRegion];

    // Left Region
    generateRandomCords([10,680],[10,730],structures,1000);
    // Bottom Region
    generateRandomCords([700,1300],[600,730],structures,200);
    // Top Regiom
    generateRandomCords([700,1300],[0,80],structures,200);
    // Right region
    generateRandomCords([1200,1900],[10,730],structures,1000);

    // Draw nature
    structures.forEach((cord,index) => {
            if (index % 2 === 0) {
                if (index % 4 === 0)  drawImage(bgCtx,"./assets/images/land/rock.png", cord[0], cord[1], 10, 10); 
                else drawImage(bgCtx,"./assets/images/land/tree.png", cord[0], cord[1], 20, 20); 
            }

            else {
                drawImage(bgCtx,"./assets/images/land/bush.png", cord[0], cord[1], 10, 10); 
            }    
    });    
}

const gameMoveHandler = event => {
    const {clientX, clientY} = event;

    gameCanvas.classList.remove('hover-state');
    if (checkRegion(clientX, clientY, regions)) {
      
        gameCanvas.classList.add('hover-state');
    }
    else {
        gameCanvas.classList.remove('hover-state');
    }
}

const modalHandler = (e) => {
    modalBackground.classList.add('hidden');
    modal.classList.add('hidden');
    clearInterval(timer);
    timer = null;
    if (battleState) document.querySelector('#run').dispatchEvent(new Event("click"));
}

modalBackground.addEventListener('click',(e)=> modalHandler(e));
gameCanvas.addEventListener('click', gameClickHandler, false);
gameCanvas.addEventListener('mousemove', gameMoveHandler, false);

buildingsOption.forEach(option => option.addEventListener('click', (e) => {
    buildingsOption.forEach(option => {
        option.classList.remove('selected');
    });

    e.target.classList.add('selected');
    selected = e.target.id;

    const currentBuilding = allBuildings.find(building => building.name === selected);
    const selectedDescription = selectedOption.children[0];
    const selectedImage = selectedOption.children[1];
    selectedDescription.children[0].innerText = currentBuilding.name;
    selectedDescription.children[1].innerText = currentBuilding.info;
    selectedImage.src = currentBuilding.imageUrl;    

}));

start.addEventListener('click', () => {
    loadGame();
   
});

reset.addEventListener('click', () => {
    resetGame();
})

resetGame();

const startWeather = () => {
    weatherCtx.globalAlpha = 0.5;
    weatherCtx.fillStyle = 'rgba(255, 255, 255, 0)';
    weatherCtx.clearRect(0,0,weatherCanvas.width,weatherCanvas.height);
    drawWeather();
    updateWeather();  
}



let particlesContainer = [];
let particles = 5000;

for( let i = 0; i < particles; i++) {
    particlesContainer.push({
      x: Math.random() * weatherCanvas.width,
      y: 0,
      speed: 2,
      velocity: Math.random() * 4.5,
      size: Math.random() * 1 + 1,
    })
}

const updateWeather = () => {
    for (let i = 0; i < particles; i++) {
        particlesContainer[i].y += particlesContainer[i].velocity;
        if (particlesContainer[i].y >= weatherCanvas.height) {
            particlesContainer[i].y = 0;
            particlesContainer[i].x = Math.random * weatherCanvas.width;
        }
    }
}

const drawWeather = () => {
    for (let i = 0; i < particles; i++) {
        const {x, y, size} = particlesContainer[i];
        weatherCtx.beginPath();
        weatherCtx.fillStyle = 'white';
        weatherCtx.arc(x , y, size, 0, Math.PI * 2);
        weatherCtx.fill();
    }
}


const randomEvent = () => {
    const villagersLost = user.villagers >= 5 ? randomNumber(1,user.villagers - 2) : 1;
    displayMessage(`<h1>Let it snow!!! Your will lose ${villagersLost} villagers!!!</h1>`);
    user.villagers -= villagersLost;
    renderUserStats();
    randomTimer = setInterval(startWeather,10);
}

displayModal('<h1>Objective is to double your villagers.</h1><p>You can buy villagers in the castle.Click on random forest around to attack monsters and gather resources.Attack increase your chances of winning and defense increases your chances of escaping.</p>');