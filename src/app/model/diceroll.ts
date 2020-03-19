

export class DiceRoll {
  result: number[];
  modifier: number;

    constructor(dice?: number[]) {
        this.result = dice ? dice : this.standardDice();
        this.modifier = 0;
    }

    get standardResult(): number {
        return this.result[0] + this.result[1] + this.modifier;
    }

    get lowluckResult(): number {
        let lowluckResult = this.modifier;
        this.result.forEach((die) => {
            if(die < 4) {
                lowluckResult += 4;
            } else if(die >6) {
                lowluckResult += 6;
            } else {
                lowluckResult += 5;
            }
        });
        return lowluckResult;
    }

    getDieRoll(sides: number): number {
        return 1 + Math.floor(Math.random()*sides);
    }

    standardDice(): number[] {
        let result = [];
        let die = this.getDieRoll(8);
        result.push(die==1?5:die);
        die = this.getDieRoll(8);
        result.push(die==1?5:die);
        return result;
    }
}
