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

	private navigate(directions: string[]): coordinate {
		let position: coordinate = {x: 0, y: 0};
		
		directions.forEach((value) => {
			const action: string[] = value.split(" ");
			this.move(position, action)
		});

		return position;
	}

	private move(position: coordinate, action: string[]): coordinate {
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

	private navigateWithAim(directions: string[]): coordinate {
		let position: coordinateWithAim = {x: 0, y: 0, aim: 0};
		
		directions.forEach((value) => {
			const action: string[] = value.split(" ");
			this.moveWithAim(position, action)
		});

		return position;
	}

	private moveWithAim(position: coordinateWithAim, action: string[]): coordinateWithAim {
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

interface coordinate {
	x: number;
	y: number;
}

interface coordinateWithAim extends coordinate {
	aim: number;
}

