import { fileToArray } from "../utils/utils";

function problem1(): void {
    const input = fileToArray("../../resources/day1.txt").map(str => +str);
    console.log(countArrayIncreases(input));
}

function problem2(): void {
    const input = fileToArray("../../resources/day1.txt").map(str => +str);
    console.log(countArrayIncreases(input, 3));
}

/**
 * Compares entries in an array to determine if consecutive sums are increasing or decreasing in value.
 * @param input Array of numbers
 * @param averageOverEntryCount number of entries to sum
 * @returns Number of increases or -1 if an error
 */
function countArrayIncreases(input: number[], averageOverEntryCount: number = 1): number {
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

//run
problem1();
problem2();