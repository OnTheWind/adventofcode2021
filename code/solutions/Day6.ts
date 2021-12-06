import { Day } from "./Day";

export class Day6 extends Day {
	getName(): string {
		return "Day 6";
	}

	schoolOfLanternFish: SchoolOfLanternFish;

	constructor(inputPath: string) {
		super(inputPath);

		this.schoolOfLanternFish = new SchoolOfLanternFish(this.inputArray[0], 7, 9);
	}

	problem1(): string {
		return this.schoolOfLanternFish.fishCountAfterDaysEfficient(80).toString();
		//return this.schoolOfLanternFish.fishCountAfterDays(80).toString();
	}

	problem2(): string {
		return  this.schoolOfLanternFish.fishCountAfterDaysEfficient(256).toString();
		//return this.schoolOfLanternFish.fishCountAfterDays(256).toString();
    }
}

class SchoolOfLanternFish {
	schoolOfFish: number[];

	breedTimer: number;
	newFishTimer: number;

	constructor(inputString: string, breedTimer: number, newFishTimer: number) {
		this.breedTimer = breedTimer;
		this.newFishTimer = newFishTimer;

		this.schoolOfFish = inputString.split(",").map(fish => +fish);
	}

	/**
	 * Transforms the input array from a list of fish with counters to number of fish for each timer value. For example, [1, 2, 3, 3] -> [null, 1, 1, 2]
	 * @param schoolOfFish 
	 * @returns Array of counts of fish with each timer value
	 */
	private __countFish(schoolOfFish: number[]): number[] {
		let fishCounts: number[] = [];

		schoolOfFish.forEach(fish => {
			if(!fishCounts[fish]) {
				fishCounts[fish] = 1;
			} else {
				fishCounts[fish]++;
			}
		});

		return fishCounts;
	}

	/**
	 * Returns the number of fish that exist after N days
	 * @param days Number of days to simulate
	 * @returns Total number of fish
	 */
	fishCountAfterDays(days: number): number {
		const fishCounts = this.__countFish(this.schoolOfFish);

		//Loop over all buckets for breed timing and populate later buckets
		for (let day = 0; day < days; day++) {
			//If this bucket has fish that will breed, take action
			if (fishCounts[day]) {
				this.__breedOnDay(day, days, fishCounts);
			}
		}
		return fishCounts.reduce((total, count) => total += count);
	}

	/**
	 * For a given time range, produces new spawns of fish that the given pool will have on each day
	 * @param day Day of fish to breed for the entire range
	 * @param days Day number to breed until
	 * @param fishCounts Array of fish and their timers with respect to day 0. Will have new fish added to it
	 */
	private __breedOnDay(day: number, days: number, fishCounts: number[]): void {
		//For today and each breeding cycle, add fish to the bucket that will breed in the future
		for (let breedingDay = day; breedingDay < days; breedingDay += this.breedTimer) {
			const newFishTimer = breedingDay + this.newFishTimer;
			if (!fishCounts[newFishTimer]) {
				fishCounts[newFishTimer] = 0;
			}
			fishCounts[newFishTimer] += fishCounts[day];
		}
	 }

	 /**
	  * A more mathy approach to solving the problem. Population growth can be based on pascal's triangle due to how
	  * maturity and reproduction rates interact
	  * @param days total number of days to observe
	  * @returns fish at the end of the observation
	  */
	 fishCountAfterDaysEfficient(days: number): number {
		const fishCounts = this.__countFish(this.schoolOfFish);

		let totalFish = 0;
		fishCounts.forEach((breedingFish:number, day: number) => {
			totalFish += breedingFish * this.__numberOfBreeds(days - day);
		});

		return totalFish;
	 }

	 /**
	  * Counts the number of times a fish and its kin with a specific timer reproduce over the time period
	  * @param days number of days to observe
	  * @returns total number of fish
	  */
	 private __numberOfBreeds(days: number): number {
		const completeGenerationCount = Math.floor((days-1) / this.newFishTimer) + 1;
		const incompleteGenerationCount = Math.floor((days-1) / this.breedTimer) + 1;

		//Sum the number of fish from completed generations
		let numberOfFish = Math.pow(2, completeGenerationCount);

		//Sum the number of fish from the incomplete generation
		for (let generation = completeGenerationCount + 1; generation <= incompleteGenerationCount; generation++) {
			const numTerms = Math.ceil((days - ((generation - 1) * this.breedTimer))/2);
			numberOfFish += this.__sumOfFirstPascalTerms(generation, numTerms);
		}
		
		return numberOfFish;
	 }

	 /**
	  * Sums the first i numbers in the Nth row of Pascal's triangle
	  * @param row row in pascal's triangle with "1" being the first row
	  * @param term number of terms to sum
	  * @returns sum of terms
	  */
	 private __sumOfFirstPascalTerms(row: number, term: number): number {
		let prev = 1;
		let sum = 1;
		for (let i = 1; i <= term - 1; i++) {
			const cur = (prev * (row - i))/ i;
			sum += cur;
			prev = cur;
		}
		return sum;
	 }
}