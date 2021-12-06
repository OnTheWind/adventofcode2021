import { Day } from "./Day";

export class Day5 extends Day {
	getName(): string {
		return "Day 5";
	}

	problem1(): string {
		const vents = new HydroThermalVents(this.inputArray, true);
		return vents.collisions.toString();
	}

	problem2(): string {
		const vents = new HydroThermalVents(this.inputArray);
		return vents.collisions.toString();
    }
}

class HydroThermalVents {
	ignoreDiagonals: boolean;
	coordinateMap: number[][] = [];
	collisions: number;

	constructor(inputArray: string[], ignoreDiagonals: boolean = false) {
		this.ignoreDiagonals = ignoreDiagonals;
		this.collisions = 0;

		this.__parseInput(inputArray);
	}

	/**
	 * Parse the input to create a vent map
	 * @param inputArray array of input vent lines in the form of x,y -> x,y
	 */
	private __parseInput(inputArray: string[]): void {
		inputArray.forEach((vent) => {
			if (vent.length === 0) {
				return;
			}

			const coordinates = vent.split(" -> ");
			const start = coordinates[0].split(",").map(string => +string);
			const end = coordinates[1].split(",").map(string => +string);
			this.__drawLine(start, end);
		});
	}

	/**
	 * Draw a line of vents from the start coordinate to the end coordinate. Increments collision counter when found.
	 * @param start Array of coordinate [x,y]
	 * @param end Array of coordinate [x,y]
	 */
	private __drawLine(start: number[], end: number[]): void {
		if (this.ignoreDiagonals) {
			if (start[0] !== end[0] && start[1] !== end[1]) {
				return;
			}
		}

		const xIncrementer = this.__getIncrementer(start[0], end[0]);
		const yIncrementer = this.__getIncrementer(start[1], end[1]);

		//If both incrementers exist, verify they have equal magnitude
		if (xIncrementer !== 0 && yIncrementer !== 0) {
			if (Math.abs(start[0]-end[0]) !== Math.abs(start[1]-end[1])) {
				console.log("Error: ({0},{1}) -> ({2}, {3}) has an invalid slope.", start[0], start[1], end[0], end[1]);
				return;
			}
		}

		let curPos = start;
		while(true) {
			this.__addVent(curPos[0], curPos[1]);

			if (curPos[0] === end[0] && curPos[1] === end[1]) {
				return;
			}

			curPos[0] += xIncrementer;
			curPos[1] += yIncrementer;
		}
	}

	/**
	 * Adds a vent to the coordinate map and increments collisions if the coordinate is already on the map.
	 * @param x x coordinate
	 * @param y y coordinate
	 */
	private __addVent(x: number, y: number): void {
		if (!this.coordinateMap[x]) {
			this.coordinateMap[x] = [];
		}
		if (!this.coordinateMap[x][y]) {
			this.coordinateMap[x][y] = 1;
		}
		else {
			this.coordinateMap[x][y]++;
			
			if (this.coordinateMap[x][y] === 2) {
				this.collisions++;
			}
		}
	}

	/**
	 * Returns incrementer for the coordinate's x or y values
	 * @param firstCoord value of the start coordinate
	 * @param secondCoord value of the end coordinate
	 * @returns 1 if first is smaller than second, -1 if first is greater than second, 0 if equal
	 */
	private __getIncrementer(firstCoord: number, secondCoord: number): number {
		if (firstCoord < secondCoord) {
			return 1;
		}
		else if (firstCoord > secondCoord) {
			return -1;
		}
		return 0;
	}
}