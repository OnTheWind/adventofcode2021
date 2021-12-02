import { fileToArray } from "../utils/utils";

export abstract class Day {
	protected inputArray: string[];

	constructor(inputPath: string) {
		this.inputArray = fileToArray(inputPath);
	}

	public print(): void {
		console.log(this.getName());
		console.log("  1: " + this.problem1());
		console.log("  2: " + this.problem2());
		console.log("-----------------------");
	}

	abstract getName(): string;
	abstract problem1(): string;
	abstract problem2(): string;
}