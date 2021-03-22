import {Building} from './assets/classes/building.js';

// Dom Elements
const bgCanvas = document.getElementById('bg-view');
const gameCanvas = document.getElementById('game-view');
const buildButton = document.getElementById('build-button');
const buildingsOption = document.querySelectorAll('.buildings-option');
const selectedOption = document.getElementById('selected-option');
const modalBackground = document.getElementById('modal-background');
const modal = document.getElementById('modal');

// Globals
const userBuildings = [];
const allBuildings = [
    {name: 'farm', imageUrl: './assets/images/buildings/farm.svg',type: 'food'},
    {name: 'tower', imageUrl: './assets/images/buildings/tower.svg',type: 'money',},
    {name: 'blacksmith', imageUrl: './assets/images/buildings/blacksmith.svg',type: 'money'},
    {name: 'beer', imageUrl: './assets/images/buildings/beer.svg',type: 'money'},
    {name: 'church', imageUrl: './assets/images/buildings/church.svg',type: 'money'},
    {name: 'fishing', imageUrl: './assets/images/buildings/fishing.svg',type: 'food'},
    {name: 'grave', imageUrl: './assets/images/buildings/grave.svg',type: 'money'},
    {name: 'barracks', imageUrl: './assets/images/buildings/barracks.svg',type: 'money'},
    {name: 'pyramid', imageUrl: './assets/images/buildings/pyramid.svg',type: 'money'},
    {name: 'warehouse', imageUrl: './assets/images/buildings/warehouse.svg',type: 'manage'},
];
let selected = 'farm';
//  {name: 'farm', imageUrl: './assets/images/buildings/farm.svg',type: 'food'},
// Inital Setup for Canvas
bgCanvas.width = bgCanvas.scrollWidth;
bgCanvas.height = bgCanvas.scrollHeight;
gameCanvas.width = bgCanvas.scrollWidth;
gameCanvas.height = bgCanvas.scrollHeight;
const bgCtx = bgCanvas.getContext('2d');
const gameCtx = gameCanvas.getContext('2d');




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

const drawBorder = (ctx,posX,posY,width,height) => {
    // ctx.strokeStyle = "#593C1F";
    // ctx.lineWidth= 5;
    // ctx.strokeRect(posX,posY,width,height);
    ctx.strokeRect(posX,posY,width,height);
 
    
}

const isUserbuilding = (region) => {

    for (let j = 0 ; j < userBuildings.length; j++) {
        if (JSON.stringify(region) === JSON.stringify(userBuildings[j].location)) return true;
    }
    
    return false;
}   

const showMenu = (building) => {
    modal.innerHTML = '';
    let innerhtml = ''
    switch(building.name) {
        case 'castle': 
            innerhtml = `<h1>Castle</h1> <img class='modal-image' src='${building.imageUrl}'> <form> <input type="number"> <button>Buy Villagers </button>`;
            modal.innerHTML = innerhtml;
            document.querySelector('#modal form').addEventListener('submit', (e) => e.preventDefault());
            break;

        default: 
            break;
    }


}

const gameClickHandler = e => {
    const {clientX, clientY} = e;
    if (checkRegion(clientX, clientY, regions)) {
        const currentRegion = showRegion(clientX, clientY, regions);
     
        if (isUserbuilding(currentRegion)) {
            modalBackground.classList.remove('hidden');
            modal.classList.remove('hidden');
            const currentBuilding = userBuildings.find(building => JSON.stringify(building.location) === JSON.stringify(currentRegion));
            showMenu(currentBuilding);
        }

        else {
         
            createBuilding(clientX, clientY, regions);
        }
      
        


    }

}

const createBuilding = (clientX, clientY, regions) => {
    
    const currentRegion = showRegion(clientX,clientY,regions);
    const currentBuilding = allBuildings.find(building => building.name === selected);
    const newBuilding = new Building(currentBuilding.name,currentBuilding.imageUrl, [currentRegion[0], currentRegion[1]], currentBuilding.type);
    userBuildings.push(newBuilding);
    drawImage(gameCtx,currentBuilding.imageUrl, currentRegion[0], currentRegion[1], 90, 90);
}


const gameHoverHandler = (event,action) => {
    const {clientX, clientY} = event;

    if (checkRegion(clientX, clientY, regions)) {
        
        action === "enter" ? gameCanvas.classList.add('hover-state') : gameCanvas.classList.remove('hover-state');
    }
   
}






const resources = [
    {name: 'money',total: 0},
    {name: 'steel',total: 0}, 
    {name: 'minerals',total: 0}, 
    {name: 'crypto',total: 0}, 
    {name: 'wood',total: 0}, 
]

bgCtx.fillStyle = "#567d46";
bgCtx.fillRect(0,0,bgCanvas.width, bgCanvas.height);

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
    const structures = [];
    drawImage(gameCtx,"./assets/images/buildings/castle.svg", 900, 300, 100, 100)
    userBuildings.push(new Building('castle', "./assets/images/buildings/castle.svg",[900,300],'manage'));
    // // Draw Walls
    // for (let i = 600; i <= 1200; i+= 100) {
    //     drawImage(gameCtx,"./assets/images/buildings/tower.svg", i, 0, 100, 100);
    //     drawImage(gameCtx,"./assets/images/buildings/tower.svg", i, 600, 100, 100);
    // }
    // for (let i = 100; i <= 500; i+= 100) {
    //     drawImage(gameCtx,"./assets/images/buildings/tower.svg", 600, i, 100, 100);
    //     drawImage(gameCtx,"./assets/images/buildings/tower.svg", 1200, i, 100, 100);
    // }

    drawImage('castle',)

    generateRandomCords([10,680],[10,730],structures,1000);
    generateRandomCords([700,1300],[600,730],structures,200);
    generateRandomCords([700,1300],[0,100],structures,200);
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

populateStructures();



// regions.forEach(region => {
//     ;drawImage(gameCtx,"./assets/images/buildings/castle.svg", region[0], region[1], 100, 100)
// })
const gameMoveHandler = event => {
    const {clientX, clientY} = event;
    gameCanvas.classList.remove('hover-state');
    if (checkRegion(clientX, clientY, regions)) {
        gameCanvas.classList.add('hover-state');
    }
   
}


const buildButtonHandler = e => {

}




// Create our Regions
let regions = createRegions({x: 700, y: 100}, 5,5);
// drawBorder(gameCtx, 700, 50, 500, 500);

// for (let i = 0; i <= gameCanvas.width - 300; i+=100) {
//     drawBorder(gameCtx,"./assets/images/buildings/wall-horizontal.svg", i + 20, 400, 100, 100);
// }


modalBackground.addEventListener('click',(e)=> {
    modalBackground.classList.add('hidden');
    modal.classList.add('hidden');
});

gameCanvas.addEventListener('click', gameClickHandler, false);

gameCanvas.addEventListener('mousemove', gameMoveHandler, false);

buildingsOption.forEach(option => option.addEventListener('click', (e) => {
    buildingsOption.forEach(option => {
        option.classList.remove('selected');
    })
    e.target.classList.add('selected');
    const selectedImage = selectedOption.children[1];
    selectedImage.src = e.target.src;
    selected = e.target.id;
}))
// gameCanvas.addEventListener('mouseenter', (event) => gameHoverHandler(event,'enter'), false);
// gameCanvas.addEventListener('mouseleave', (event) => gameHoverHandler(event,'leave'), false);



// for (let i = 0; i < bgCanvas.height; i += 100) {
//     for (let j = 0; j < bgcanvas.width; j += 100) {       
//         drawImage("./assets/images/land/grass.png", j, i, 100, 100);
//     }
// }


