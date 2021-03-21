const bgCanvas = document.getElementById('bg-view');
const gameCanvas = document.getElementById('game-view');
const landImage = "./assets/images/land/land.png";
const regions = [
    [200,200], [400,200], [600,200], [800,200], [1000,200], [1200, 200], [1400,200],
    [200,400], [400,400], [600,400], [800,400], [1000,400], [1200, 400], [1400,400]
];

bgCanvas.width = bgCanvas.scrollWidth;
bgCanvas.height = bgCanvas.scrollHeight;
gameCanvas.width = bgCanvas.scrollWidth;
gameCanvas.height = bgCanvas.scrollHeight;

const bgCtx = bgCanvas.getContext('2d');
const gameCtx = gameCanvas.getContext('2d');


const checkRegion = (clientX,clientY,regions) => {



}

const drawImage = (ctx,src,posX,posY,width,height) => {
    const image = new Image();
    image.src = src;
    
    image.onload = () => {
        ctx.drawImage(image, posX, posY, width, height);
    }
    
}

const gameClickHandler = e => {
    const {clientX, clientY} = e;
    
    if (e.clientX > 200 && e.clientX < 300 && e.clientY > 200 && e.clientY < 300) {
     
    }
}

const gameHoverHandler = e => {
    const {clientX, clientY} = e;
    

   
    if (clientX > 200 && clientX < 300 && clientY > 200 && clientY < 300) {
   
    }

    else {
     
    }
}





const resources = [
    {name: 'money',total: 0},
    {name: 'steel',total: 0}, 
    {name: 'minerals',total: 0}, 
    {name: 'crypto',total: 0}, 
    {name: 'wood',total: 0}, 
]

drawImage(bgCtx,"./assets/images/land/bg-land.png", 0, 0, bgCanvas.width, bgCanvas.height);
regions.forEach(region => {
    drawImage(gameCtx,"./assets/images/buildings/castle.svg", region[0], region[1], 100, 100);
})

drawImage(gameCtx, "./assets/images/buildings/tower.svg", 300, 300, 100,100);

gameCanvas.addEventListener('click', gameClickHandler, false);

gameCanvas.addEventListener('mousemove', gameHoverHandler, false);

// for (let i = 0; i < bgCanvas.height; i += 100) {
//     for (let j = 0; j < bgcanvas.width; j += 100) {       
//         drawImage("./assets/images/land/grass.png", j, i, 100, 100);
//     }
// }


