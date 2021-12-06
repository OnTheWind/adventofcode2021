import { promptAction } from "./utils/utils";
import { Day } from "./solutions/Day";
import { Day1 } from "./solutions/Day1";
import { Day2 } from "./solutions/Day2";
import { Day3 } from "./solutions/Day3";
import { Day4 } from "./solutions/Day4";
import { Day5 } from "./solutions/Day5";
import { Day6 } from "./solutions/Day6";


promptAction(resolveAction);

/**
 * Runs the days the user input
 * @param answer 
 */
function resolveAction(answer: string): void {
	const map = buildDayMap();

	answer = answer.toUpperCase().trim();

	if (answer === "ALL") {
		map.forEach((value) => value.print());
	}
	else {
		map.get(answer)?.print();
	}
}

/**
 * Builds the map of AOC days mapped to user input
 * @returns the map
 */
function buildDayMap(): Map<string, Day> {
	const map = new Map<string, Day>();
	map.set("1", new Day1("../resources/day1.txt"));
	map.set("2", new Day2("../resources/day2.txt"));
	map.set("3", new Day3("../resources/day3.txt"));
	map.set("4", new Day4("../resources/day4.txt"));
	map.set("5", new Day5("../resources/day5.txt"));
	map.set("6", new Day6("../resources/test.txt"));
	return map;
}