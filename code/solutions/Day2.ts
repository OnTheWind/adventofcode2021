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
		let position: ICoordinate = {x: 0, y: 0};
		
		directions.forEach((value) => {
			const action: string[] = value.split(" ");
			this.move(position, action)
		});

		return position;
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
		let position: ICoordinateWithAim = {x: 0, y: 0, aim: 0};
		
		directions.forEach((value) => {
			const action: string[] = value.split(" ");
			this.moveWithAim(position, action)
		});

		return position;
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

interface ICoordinate {
	x: number;
	y: number;
}

interface ICoordinateWithAim extends ICoordinate {
	aim: number;
}

