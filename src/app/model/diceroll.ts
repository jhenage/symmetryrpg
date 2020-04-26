

export class DiceRoll {
  result: number[];
  modifier: number;

    constructor(); // new standard roll
    constructor(dice: number[]); // use previous roll result
    constructor(dice: number, sides: number); // roll 
    constructor(dice?: any, sides?: number) {
        if(Array.isArray(dice)) this.result = dice;
        else if(dice && dice > 0 && sides > 0) {
            this.result = [];
            for(let i=0; i<dice; i++) this.result.push(this.getDieRoll(sides));
        } else this.result = this.standardDice();
        this.modifier = 0;
    }

    get standardResult(): number {
        return this.getGenericResult(1);
    }

    get lowluckResult(): number {
        return this.getGenericResult(0.5);
    }

    get highluckResult(): number {
        return this.getGenericResult(2);
    }

    getGenericResult(diceMultiplier:number): number {
        let genericResult = this.modifier;
        this.result.forEach((die) => {
            genericResult += die * diceMultiplier;
        });
        return genericResult;
    }

    getDieRoll(sides: number): number {
        return 1 + Math.floor(Math.random()*sides);
    }

    standardDice(): number[] { // returns array of three numbers between -1 and 1 in 0.01 step increments, careful about rounding errors
        let result = [];       // this gives a total of -3 to 3 with a standard deviation of about 1.0025
        for(let i=0; i<3; i++) {
            result[i] = Math.floor(Math.random()*101)/100;
            if(Math.random() < 0.5) result[i] = -result[i];
        }
        return result;
    }
}
