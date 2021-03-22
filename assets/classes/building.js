
export class Building {
    constructor(name, imageUrl, location, resource) {
        this.name = name;
        this.imageUrl = imageUrl;
        this.location = location;
        this.resource = resource;
    }

    gain() {
        return 3;
    }


    
}





export class MoneyBuilding extends Building {
    constructor(name, imageUrl, location, resource, investAmt, risk, improvements = 0) {
        super(name, imageUrl, location, resource);
        this.investAmt = investAmt;
        this.risk = risk;
        this.improvements = improvements
    }

    gain() {
        const negativeChance = Math.round(Math.random() + this.improvements) ? 1 : -1;
        const netGain = Math.floor(Math.random() * this.investAmt * this.risk);
        const actualGain = negativeChance * netGain;
        
        return actualGain;
    }
  

}

