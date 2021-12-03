import { stringify } from "querystring";
import { Day } from "./Day";

export class Day3 extends Day {
	getName(): string {
		return "Day 3";
	}

	problem1(): string {
		const bitCount: number[] = this.inputArray.reduce(this.computeLine, []);
		const measurment = this.bitCountToMeasurement(bitCount);
		return (measurment[0] * measurment[1]).toString();
	}

	problem2(): string {
		const tree = this.binaryArrayToTree(this.inputArray);
		return (Number.parseInt(this.traverseTree(tree, TraverseMode.MostCommonBit), 2) * Number.parseInt(this.traverseTree(tree, TraverseMode.LeastCommonBit), 2)).toString();
	}

	/**
	 * Processes one binary string and stores the result in the tracker. 01100 would add [-1, 1, 1, -1, -1] to the tracker
	 * @param tracker Array of bit counts
	 * @param currentLine current binary string to process
	 * @returns tracker
	 */
	computeLine(tracker: number[], currentLine: string): number[] {
		for (let i = 0; i < currentLine.length; i++) {
			tracker[i] = (!!tracker[i] ? tracker[i] : 0) + (currentLine[i] === "1" ? 1 : -1);
		}
		
		return tracker;
	}

	/**
	 * Takes an array of bit counts (number of 1s minus number of 0s per bit) and returns two 
	 * numbers: The decimal representation of the list of most common bits and least common bits
	 * @param bitCount array of 1 vs 0 bit differential
	 * @returns two decimal numbers representing the compiled most common bits and least common bits
	 */
	bitCountToMeasurement(bitCount: number[]): number[] {
		let currentBit = 0;
		return bitCount.reduceRight((output: number[], currentValue, index) => {
			output[currentValue >= 0 ? 1 : 0] += Math.pow(2,(currentBit++));
			return output;
		}, [0, 0]);
	}

	/**
	 * Transforms an input array into a tree sorted by 1s and 0s
	 * @param inputArray Array of binary strings
	 * @returns A tree with the count of binary strings in that branch
	 */
	binaryArrayToTree(inputArray: string[]): Tree | undefined {
		let tree: Tree = { "1": { count: 0}, "0": { count: 0 }};
		let splitArray: string[][] = [[], []];
		
		inputArray.forEach((value) => {
			if (value.length > 0 && (value[0] === "0" || value[0] === "1")) {
				tree[value[0]].count++;
				if (value.length > 1) {
					splitArray[+value[0]].push(value.substring(1));
				}
			}
		});
		
		if (splitArray[1].length > 0) {
			tree[1].tree = this.binaryArrayToTree(splitArray[1]);
		}
		
		if (splitArray[0].length > 0) {
			tree[0].tree = this.binaryArrayToTree(splitArray[0]);
		}
		return tree;
	}

	/**
	 * Traverses a tree by following the node with the most entries or least entries and returns the binary string found at the end.
	 * @param tree Tree to traverse
	 * @param mode Traverse by least common or most common bit
	 * @returns binary string found
	 */
	traverseTree(tree: Tree | undefined, mode: TraverseMode): string {
		if (!tree) return "";

		let bit: "0" | "1" | undefined = undefined;
		if (mode === TraverseMode.MostCommonBit) {
			//Equal counts go to the 1 bit
			bit = (tree[0].count > tree[1].count) ? "0" : "1";
		}
		else if (mode === TraverseMode.LeastCommonBit) {
			//Equal counts go to the 0 bit
			if (tree[0].count === 0) {
				bit = "1";
			}
			else if (tree[1].count === 0) {
				bit = "0";
			}
			else {
				bit = (tree[1].count < tree[0].count) ? "1" : "0";
			}
		}

		return bit + (bit ? this.traverseTree(tree[bit].tree, mode) : "");
	}
}

interface Tree {
	"1": TreeNode,
	"0": TreeNode
}


interface TreeNode {
	count: number,
	tree?: Tree
}

enum TraverseMode {
	MostCommonBit,
	LeastCommonBit
}