import { Day } from "./Day";

export class Day2 extends Day {
	getName(): string {
		return "Day 2";
	}

	problem1(): string {
		const finalCoordinate = this.navigate(this.inputArray);
		return (finalCoordinate.x * finalCoordinate.y).toString();
	}

	problem2(): string {
		const finalCoordinate = this.navigateWithAim(this.inputArray);
		return (finalCoordinate.x * finalCoordinate.y).toString();
	}

	private navigate(directions: string[]): ICoordinate {
		const navigator = (accumulator: ICoordinate, currentValue: string) => { return this.move(accumulator, currentValue.split(" ")); };
		return directions.reduce<ICoordinate>(navigator, {x: 0, y: 0});
	}

	private move(position: ICoordinate, action: string[]): ICoordinate {
		const direction = action[0];
		let magnitude = +action[1];
		switch(action[0]) {
			case "forward":
				position.x += magnitude;
				break;
			case "up":
				magnitude *= -1;
			case "down":
				position.y += magnitude;
		}

		return position;
	}

	private navigateWithAim(directions: string[]): ICoordinate {
		const navigator = (accumulator: ICoordinateWithAim, currentValue: string) => { return this.moveWithAim(accumulator, currentValue.split(" ")); };
		return directions.reduce<ICoordinateWithAim>(navigator, {x: 0, y: 0, aim: 0});
	}

	private moveWithAim(position: ICoordinateWithAim, action: string[]): ICoordinateWithAim {
		const direction = action[0];
		let magnitude = +action[1];
		switch(action[0]) {
			case "forward":
				position.x += magnitude;
				position.y += (magnitude * position.aim);
				break;
			case "up":
				magnitude *= -1;
			case "down":
				position.aim += magnitude;
		}

		return position;
	}

}

type navigator<U> = (accumulator: U, currentValue: string) => U;

interface ICoordinate {
	x: number;
	y: number;
}

interface ICoordinateWithAim extends ICoordinate {
	aim: number;
}

