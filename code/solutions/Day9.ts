import { Day } from "./Day";

export class Day9 extends Day {
	getName(): string {
		return "Day 9";
	}

	elevationMap: ElevationMap

	constructor(inputPath: string) {
		super(inputPath);

		this.elevationMap = new ElevationMap(this.inputArray);
	}

	problem1(): string {
		return this.elevationMap.sumLowPoints().toString();
	}

	problem2(): string {
		return this.elevationMap.findBasins(3).reduce((product: number, basinSize: number) => product = product * basinSize, 1).toString();
    }
}

class ElevationMap {
	elevation: number[][];
	lowPoints: coord[] = [];

	constructor(inputArray: string[]) {
		this.elevation = [];
		inputArray.forEach((currentRow) => {
			let row: number[] = [];
			for (let i = 0; i < currentRow.length; i++) {
				row.push(+currentRow[i]);
			}
			this.elevation.push(row);
		});

		this.__findTroughs();
	}

	/**
	 * Sums the height + 1 of each trough in the map
	 * @returns sum
	 */
	sumLowPoints(): number {
		return this.lowPoints.reduce((sum: number, trough: coord) => sum += this.elevation[trough.y][trough.x] + 1, 0);
	}

	/**
	 * Returns the N largest basins on the map
	 * @param findLargestCount returns the largest N basins. Pass in undefined or <1 for all
	 * @returns array of basin sizes
	 */
	findBasins(findLargestCount?: number): number[] {
		let basins: number[] = [];
		this.lowPoints.forEach((lowPoint: coord) => {
			basins.push(this.__findBasin(lowPoint));
		});
		if (!findLargestCount || findLargestCount < 1 || findLargestCount >= basins.length) {
			return basins;
		}
		return basins.sort((a, b) => {return b-a}).slice(0, findLargestCount);
	}

	/**
	 * Given a coordinate, finds the size of the basin
	 * @param lowPoint low point coordinate for the basin
	 * @returns size of the basin
	 */
	__findBasin(lowPoint: coord): number {
		let checkedMap: boolean[][] = [];
		return this.__checkCoordinate(checkedMap, lowPoint);
	}

	/**
	 * Checks if a given coordinate is in the basin. If it is, it will add it to the checked map, check all neighbors, and return 1 for each coordinate found 
	 * @param checkedMap 
	 * @param coordinate coordinate to check
	 * @returns 1 for each branched coordinate in the basin
	 */
	__checkCoordinate(checkedMap: boolean[][], coordinate: coord): number {
		//Outside the vertical edges of the map
		if (coordinate.y < 0 || coordinate.y === this.elevation.length) {
			return 0;
		}
		//Outside the horiontal edges of the map
		if (coordinate.x < 0 || coordinate.x === this.elevation[coordinate.y].length) {
			return 0;
		}
		//Hit a 9, so stop
		if (this.elevation[coordinate.y][coordinate.x] === 9) {
			return 0;
		}
		
		//If the row hasn't been checked yet, create a new array for it
		if (!checkedMap[coordinate.y]) {
			checkedMap[coordinate.y] = [];
		}
		//If we've added it already
		else if (checkedMap[coordinate.y][coordinate.x]) {
			return 0;
		}

		//Mark this position as checked
		checkedMap[coordinate.y][coordinate.x] = true;

		//Check neighbors and return
		return this.__checkCoordinate(checkedMap, { x: coordinate.x - 1, y: coordinate.y }) +
		this.__checkCoordinate(checkedMap, { x: coordinate.x + 1, y: coordinate.y }) +
		this.__checkCoordinate(checkedMap, { x: coordinate.x, y: coordinate.y - 1 }) +
		this.__checkCoordinate(checkedMap, { x: coordinate.x, y: coordinate.y + 1 }) + 1;
	}

	/**
	 * Finds all spaces that are lower than all of their neighbors
	 */
	__findTroughs(): void {
		for (let y=0; y < this.elevation.length; y++) {
			for (let x=0; x < this.elevation[y].length; x++) {
				if (this.__isTrough(x,y)) {
					this.lowPoints.push({x: x, y: y});
				}
			}
		}
	}

	/**
	 * Compares a coordinate to its neighbors to determine if it is lower than it
	 * @param x x coordinate
	 * @param y y coordinate
	 * @returns true if it is lower than its neighbors
	 */
	private __isTrough(x: number, y: number): boolean {
		//If not lower than vertical neighbors
		if ([y-1,y+1].some((y2) => y2 > -1 && y2 < this.elevation.length && this.elevation[y][x] >= this.elevation[y2][x]))
		{
			return false;
		}
		//If not lower than horizontal neighbors
		if ([x-1,x+1].some((x2) => x2 > -1 && x2 < this.elevation[y].length && this.elevation[y][x] >= this.elevation[y][x2]))
		{
			return false;
		}
		console.log(x,y);
		return true;
	}
}

interface coord {
	x: number,
	y: number
}