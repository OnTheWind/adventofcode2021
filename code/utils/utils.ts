import * as fs from "fs";

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