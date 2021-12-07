import { Day } from "./Day";

export class Day7 extends Day {
	getName(): string {
		return "Day 7";
	}

	constructor(inputPath: string) {
		super(inputPath);

		this.swarmOfCrabs = new SwarmOfCrabs(this.inputArray[0]);
	}

	swarmOfCrabs: SwarmOfCrabs;

	problem1(): string {
		return this.swarmOfCrabs.gasToPosition(this.swarmOfCrabs.findMedian(), SwarmOfCrabs.linearConsumptionFunction).toString();
	}

	problem2(): string {
		return this.swarmOfCrabs.gasToPosition(this.swarmOfCrabs.findMean(), SwarmOfCrabs.exponentialConsumptionFunction).toString();
    }
}

class SwarmOfCrabs {
	crabArray: number[];
	totalCrabs: number;

	constructor(inputString: string) {
		this.crabArray = [];
		this.totalCrabs = 0;

		inputString.split(",").forEach((string) => {
			const position = +string;
			this.crabArray[position] = this.crabArray[position] ? this.crabArray[position] + 1 : 1;
			this.totalCrabs++;
		});
	}

	/**
	 * Finds the median position of all crabs. Optimal for linear consumption of fuel
	 * @returns 
	 */
	findMedian(): number {
		const half = this.totalCrabs / 2;
		let total = 0;
		let median = -1;
		this.crabArray.some((numCrabs, position) => {
			total += numCrabs;
			if (total >= half) {
				median = position;
				return true;
			}
		});
		return median;
	}

	/**
	 * Finds the floor of the mean position of all crabs. Optimal for exponential consumption of fuel
	 * @returns the mean
	 */
	findMean(): number {
		return Math.floor(this.crabArray.reduce((total, numCrabs, curPosition) => total += (numCrabs * curPosition)) / this.totalCrabs);
	}

	/**
	 * Calculates gas use to move all crabs to input position using the input consumption function
	 * @param position target position
	 * @param consumptionFunction 
	 * @returns 
	 */
	gasToPosition(position: number, consumptionFunction: (position: number) => consumptionFunction): number {
		const reducer = consumptionFunction(position);
		return this.crabArray.reduce(reducer, 0);
	}

	/**
	 * Creates a linear consumption function for a given position
	 * @param position position to calculate to
	 * @returns consumption function
	 */
	static linearConsumptionFunction(position: number): consumptionFunction {
		return function (gas: number, numCrabs: number, curPosition: number): number  {
			return gas += (numCrabs * Math.abs(curPosition - position));
		}
	}

	/**
	 * Creates an exponential consumption function for a given position
	 * @param position position to calculate to
	 * @returns consumption function
	 */
	static exponentialConsumptionFunction(position: number): consumptionFunction {
		return function (gas: number, numCrabs: number, curPosition: number): number  {
			const distToPos = Math.abs(curPosition - position);
			return gas += (numCrabs * distToPos * (distToPos + 1) /2);
		}
	}
}

type consumptionFunction = {
	(gas: number, numCrabs: number, curPosition: number): number;
}