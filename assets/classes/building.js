
export class Building {
    constructor(name, imageUrl, location, resource, cost, info) {
        this.name = name;
        this.imageUrl = imageUrl;
        this.location = location;
        this.resource = resource;
        this.cost = cost;
        this.timeID = null;
        this.info = info;
    }

    boost(user) {
        switch(this.name) {
            case 'Tower':
                user.defense += 10;
                break;
            case 'Blacksmith':
                user.attack += 10;
                break;
            case 'Barracks': 
                user.attack += 10;
                user.defense += 10;
                break;
        }
      
    }

    boostBuildings(buildings) {
        let capacityBuildings = buildings.filter(building => !!building.capacity);
        capacityBuildings.forEach(building => building.capacity += 10);
    }

   
    
}

export class CollectBuilding extends Building {
    constructor(name, imageUrl, location, resource, cost, capacity, info, growth, id) {
        super(name, imageUrl, location, resource, cost, info);
        this.growth = growth;
        this.capacity = capacity;
        this.total = 0;
        this.id = id;
    }


    gain() {
        const html = document.getElementById(`build-total-${this.id}`);
        if (this.total < this.capacity) {
            this.total += this.growth;
        }
        else {
            this.total = this.capacity;
            
        }
        if(html) html.innerText = this.total;
    }

    start() {
        const timer = setInterval(() => {
            this.gain();
        },1000);

        this.timeID = timer;
    }


    collect() {
        this.total = 0;
        clearInterval(this.timeID);
        this.start();
    }
}



