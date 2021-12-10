import { Day } from "./Day";

export class Day10 extends Day {
	getName(): string {
		return "Day 10";
	}

	invalidCharacters: string[];
	missingCharacters: string[];

	constructor(inputPath: string) {
		super(inputPath);
		this.invalidCharacters = [];
		this.missingCharacters = [];

		this.inputArray.forEach((line) => this.__findInvalidCharacters(line));
	}

	problem1(): string {
		const total = this.invalidCharacters.reduce((total: number, character: string) => total += this.__incorrectCharacterToPoints(character), 0)
		return total.toString();
	}

	problem2(): string {
		let lineScores: number[] = [];
		const total = this.missingCharacters.forEach((characters: string) => lineScores.push(this.__remainingCharactersToPoints(characters)));
		lineScores.sort((a, b) => a - b);
		return lineScores[(lineScores.length-1)/2].toString();
    }

	/**
	 * Given an input line of brackets, sorts invalid lines by pushing an invalid character to this.invalidCharacters or the missing 
	 * closing characters to this.missingCharacters
	 * @param line line of brackets ([{<>}])
	 */
	__findInvalidCharacters(line: string): void {
		let characterStack: string[] = [];

		for (let i = 0; i < line.length; i++) {
			//If it's a closing character
			if (this.closingCharacters.has(line[i])) {
				const openChar = characterStack.pop();
				if (openChar === "") {
					return;
				}
				if (this.closingCharacters.get(line[i])?.open !== openChar) {
					this.invalidCharacters.push(line[i]);
					return;
				}
			}
			//else add it to the stack
			else {
				characterStack.push(line[i]);
			}
		}

		if (characterStack.length > 0) {
			this.missingCharacters.push(characterStack.reduceRight((characters: string, open: string) => characters += this.openingCharacters.get(open), ""));
		}
	}

	/**
	 * Given an incorrect closing character, returns the number of points it's worth
	 * @param character )]}>
	 * @returns a number or 0 if invalid character
	 */
	__incorrectCharacterToPoints(character: string): number {
		return this.closingCharacters.get(character)?.incorrectPoints || 0;
	}

	/**
	 * Given a list of missing closing characters, returns the number of points they're worth
	 * @param characters list of )]}> characters
	 * @returns a number or 0 if invalid/empty string
	 */
	__remainingCharactersToPoints(characters: string): number {
		let points = 0;
		for (let i = 0; i < characters.length; i++) {
			points = points * 5 + (this.closingCharacters.get(characters[i])?.remainingPoints || 0);
		}
		return points;
	}

	/**
	 * Map from opening characters to closing characters
	 */
	openingCharacters: Map<string, string> =  new Map([
		["(", ")"],
		["[", "]"],
		["{", "}"],
		["<", ">"]
	])

	/**
	 * Map of closing characters to openings characters and their point values
	 */
	closingCharacters: Map<string, closeCharacter> = new Map([
		[")", {open: "(", incorrectPoints: 3, remainingPoints: 1}],
		["]", {open: "[", incorrectPoints: 57, remainingPoints: 2}],
		["}", {open: "{", incorrectPoints: 1197, remainingPoints: 3}],
		[">", {open: "<", incorrectPoints: 25137, remainingPoints: 4}]
	]);
}

interface closeCharacter {
	open: string,
	incorrectPoints: number,
	remainingPoints: number
}