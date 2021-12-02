import * as fs from "fs";
import * as readline from "readline";

/**
 * Imports a file for use
 * @param path path to the file to import
 * @returns an array of the file with each line as a new element in the array
 */
export function fileToArray(path: string): string[] {
    let data: string[] = [];
	try {
		data = fs.readFileSync(path, 'utf-8').toString().replace(/\r\n/g, '\n').split('\n');
	}
	catch (err) {
		console.error(err);
	}
	return data;
}

/**
 * Prompts the user for which days to execute and then calls the input callback with the response.
 * @param callback callback to handle the response
 */
export function promptAction(callback: (response: string) => void): void {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question("Which day to run? ('all' to run all): ", (response) => {
        callback(response);
        rl.close();
    });
}