import { Day } from "./Day";

export class Day1 extends Day {
    getName(): string {
        return "Day 1";
    }

    problem1(): string {
        const input = this.inputArray.map(str => +str);
        return this.countArrayIncreases(input).toString();
    }
    
    problem2(): string {
        const input = this.inputArray.map(str => +str);
        return this.countArrayIncreases(input, 3).toString();
    }

    /**
     * Compares entries in an array to determine if consecutive sums are increasing or decreasing in value.
     * @param input Array of numbers
     * @param averageOverEntryCount number of entries to sum
     * @returns Number of increases or -1 if an error
     */
    private countArrayIncreases(input: number[], averageOverEntryCount: number = 1): number {
        if (averageOverEntryCount < 1 || input.length < averageOverEntryCount + 1) {
            return -1;
        }

        let numIncreases = 0;
        for (let i = averageOverEntryCount; i < input.length; i++) {
            if (input[i] > input[i - averageOverEntryCount]) {
                numIncreases++;
            }
        }

        return numIncreases;
    }
}
