

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
        return this.result[0] + this.result[1] + this.modifier;
    }

    get lowluckResult(): number {
        let lowluckResult = this.modifier;
        for(let i=0; i<2; i++) {
            if(this.result[i] < -1) {
                lowluckResult--;
            } else if(this.result[i] >1) {
                lowluckResult++;
            }
        }
        return lowluckResult;
    }

    get genericResult(): number {
        let result = this.modifier;
        this.result.forEach((die) => {
            result += die;
        });
        return result;
    }

    getDieRoll(sides: number): number {
        return 1 + Math.floor(Math.random()*sides);
    }

    standardDice(): number[] { // returns array of two numbers between -3 and 3, with 0 twice as likely
        let result = [];
        for(let i=0; i<2; i++) {
            result[i] = this.getDieRoll(8);
            result[i] = result[i] == 1 ? 0 : result[i] - 5;
        }
        return result;
    }
}
